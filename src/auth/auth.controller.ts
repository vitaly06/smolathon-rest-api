import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import express from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({
    summary: 'Вход в систему',
    description: 'Аутентификация пользователя и получение JWT токенов',
  })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    type: SignInResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден',
  })
  @ApiUnauthorizedResponse({
    description: 'Неверный пароль',
  })
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<SignInResponseDto> {
    const result = await this.authService.signIn(dto.login, dto.password);
    this.setCookies(res, result.tokens);

    return { message: 'Вы успешно авторизовались' };
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Обновление токенов',
    description: 'Обновление access и refresh токенов',
  })
  @ApiResponse({
    status: 200,
    description: 'Токены успешно обновлены',
    type: RefreshResponseDto,
  })
  @ApiForbiddenResponse({
    description: 'Неверный или просроченный refresh token',
  })
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<RefreshResponseDto> {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token не найден');
    }

    try {
      const decoded = this.authService.decodeToken(refreshToken);
      if (!decoded || !decoded.sub) {
        throw new ForbiddenException('Неверный refresh token');
      }

      const tokens = await this.authService.refreshToken(
        decoded.sub,
        refreshToken,
      );
      this.setCookies(res, tokens);

      return { message: 'Токены успешно обновлены' };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('Ошибка при обновлении токенов');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Выход из системы',
    description: 'Завершение сессии и очистка cookies',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Успешный выход из системы',
  })
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    // Очищаем refresh token в базе данных
    if (req.user?.sub) {
      await this.authService.logout(req.user.sub);
    }

    this.clearCookies(res);
    return { message: 'Вы успешно вышли из системы' };
  }

  private setCookies(
    res: express.Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 120 * 60 * 1000, // 2 часа
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });
  }

  private clearCookies(res: express.Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
