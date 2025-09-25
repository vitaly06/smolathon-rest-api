import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    protected readonly jwtService: JwtService, // было private
    protected readonly prisma: PrismaService, // было private
    protected readonly configService: ConfigService, // было private
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();
    const accessToken = this.extractAccessToken(request);
    if (request.url.startsWith('/webhooks/')) {
      return true; // Пропускаем без аутентификации
    }

    try {
      if (accessToken) {
        try {
          // Пытаемся верифицировать access token
          await this.jwtService.verifyAsync(accessToken, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
          });
          return super.canActivate(context) as Promise<boolean>;
        } catch (accessError) {
          // Если токен просрочен, пытаемся обновить
          if (accessError.name === 'TokenExpiredError') {
            return this.refreshTokensAndContinue(context, request, response);
          }
          throw accessError;
        }
      }
      // Если access token отсутствует, пытаемся использовать refresh token
      return this.refreshTokensAndContinue(context, request, response);
    } catch (error) {
      console.error('Authentication error:', error);
      throw new UnauthorizedException('Требуется авторизация');
    }
  }

  private async refreshTokensAndContinue(
    context: ExecutionContext,
    request: Request,
    response: any,
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

      // Обновляем токены в запросе
      request.cookies['access_token'] = newTokens.accessToken;
      request.headers['authorization'] = `Bearer ${newTokens.accessToken}`;
      console.log(response);
      return super.canActivate(context) as Promise<boolean>;
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
      maxAge: 120 * 60 * 1000, // 2 часа
    });

    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
  }
}
