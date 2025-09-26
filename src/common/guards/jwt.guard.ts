import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Пропускаем webhooks без аутентификации
    if (request.url.startsWith('/webhooks/')) {
      return true;
    }

    try {
      const accessToken = this.extractAccessToken(request);

      if (accessToken) {
        try {
          // Пытаемся верифицировать access token
          await this.jwtService.verifyAsync(accessToken, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
          });

          // Добавляем пользователя в request
          const payload = await this.jwtService.decode(accessToken);
          request.user = payload;
          return true;
        } catch (accessError) {
          // Если токен просрочен, пытаемся обновить
          if (accessError.name === 'TokenExpiredError') {
            return this.refreshTokensAndContinue(context, request);
          }
          throw accessError;
        }
      }

      // Если access token отсутствует, пытаемся использовать refresh token
      return this.refreshTokensAndContinue(context, request);
    } catch (error) {
      console.error('Authentication error:', error);
      throw new UnauthorizedException('Требуется авторизация');
    }
  }

  private async refreshTokensAndContinue(
    context: ExecutionContext,
    request: Request,
  ): Promise<boolean> {
    const refreshToken = this.extractRefreshToken(request);

    if (!refreshToken) {
      throw new UnauthorizedException('Требуется авторизация');
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
          refreshToken,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Сессия устарела');
      }

      const newTokens = await this.generateTokens(payload.sub);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { refreshToken: newTokens.refreshToken },
      });

      this.setTokensToResponse(context, newTokens);

      // Добавляем пользователя в request
      request.user = payload;
      request.cookies['access_token'] = newTokens.accessToken;
      request.headers['authorization'] = `Bearer ${newTokens.accessToken}`;

      return true;
    } catch (refreshError) {
      console.error('Refresh token error:', refreshError);
      throw new UnauthorizedException('Сессия истекла, войдите снова');
    }
  }

  private extractAccessToken(request: Request): string | null {
    const token =
      request.cookies?.['access_token'] ||
      request.headers['authorization']?.split(' ')[1];
    return token || null;
  }

  private extractRefreshToken(request: Request): string | null {
    return request.cookies?.['refresh_token'] || null;
  }

  private async generateTokens(userId: number): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = { sub: userId };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '2h'),
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }),
    };
  }

  private setTokensToResponse(
    context: ExecutionContext,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const response = context.switchToHttp().getResponse();

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 120 * 60 * 1000,
    });

    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
