// auth/auth.controller.ts
import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
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
import * as requestWithUserDto from './interfaces/request-with-user.dto';
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
    headers: {
      'Set-Cookie': {
        description: 'JWT токены устанавливаются в HTTP-only cookies',
        schema: {
          type: 'string',
          example: 'access_token=eyJhbGci...; HttpOnly; Path=/; Max-Age=7200',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Пользователь не найден или неверный пароль',
    schema: {
      example: {
        statusCode: 404,
        message: 'Такой пользователь не найден',
        error: 'Not Found',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Неверные учетные данные',
    schema: {
      example: {
        statusCode: 401,
        message: 'Неверный пароль',
        error: 'Unauthorized',
      },
    },
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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Обновление токенов',
    description:
      'Обновление access и refresh токенов с использованием текущего refresh token',
  })
  @ApiBearerAuth()
  @ApiCookieAuth('refresh_token')
  @ApiResponse({
    status: 200,
    description: 'Токены успешно обновлены',
    type: RefreshResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'Новые JWT токены устанавливаются в HTTP-only cookies',
        schema: {
          type: 'string',
          example: 'access_token=eyJhbGci...; HttpOnly; Path=/; Max-Age=7200',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Неверный или просроченный refresh token',
    schema: {
      example: {
        statusCode: 403,
        message: 'Доступ запрещён',
        error: 'Forbidden',
      },
    },
  })
  async refresh(
    @Res({ passthrough: true }) res: express.Response,
    @Req() req: requestWithUserDto.RequestWithUserRefresh,
  ): Promise<RefreshResponseDto> {
    const tokens = await this.authService.refreshToken(
      req.user.sub,
      req.user.refreshToken,
    );

    this.setCookies(res, tokens);
    return { message: 'Токены успешно обновлены' };
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
    schema: {
      example: {
        message: 'Вы успешно вышли из системы',
      },
    },
    headers: {
      'Set-Cookie': {
        description: 'Cookies очищаются',
        schema: {
          type: 'string',
          example:
            'access_token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        },
      },
    },
  })
  async logout(@Res({ passthrough: true }) res: express.Response) {
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
