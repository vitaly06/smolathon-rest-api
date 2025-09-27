import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokensResponseDto } from './dto/tokens-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(
    login: string,
    password: string,
  ): Promise<{ tokens: TokensResponseDto; user: any }> {
    const user = await this.prisma.user.findUnique({
      where: { login },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException('Такой пользователь не найден');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password: _, refreshToken: __, ...userWithoutSensitiveData } = user;

    return { tokens, user: userWithoutSensitiveData };
  }

  async refreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<TokensResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Доступ запрещён: пользователь не найден');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new ForbiddenException('Доступ запрещён: неверный refresh token');
    }

    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  private async getTokens(
    userId: number,
    login: string,
  ): Promise<TokensResponseDto> {
    const payload = { sub: userId, login };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
          '2h',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async logout(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null }, // Очищаем refresh token
    });
  }

  decodeToken(token: string): any {
    try {
      return this.jwtService.decode(token);
    } catch {
      return null;
    }
  }
}
