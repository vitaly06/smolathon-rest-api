import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import express from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import * as requestWithUserDto from './interfaces/request-with-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.signIn(dto.login, dto.password);
    this.setCookies(res, result.tokens);

    return { message: 'Вы успешно авторизовались' };
  }

  @ApiOperation({
    summary: 'Обновление токенов',
  })
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(
    @Res({ passthrough: true }) res: express.Response,
    @Req() req: requestWithUserDto.RequestWithUserRefresh,
  ) {
    const tokens = await this.authService.refreshToken(
      req.user.sub,
      req.user.refreshToken,
    );

    this.setCookies(res, tokens);
    return { message: 'Токены успешно обновлены' };
  }

  private setCookies(
    res: express.Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 120 * 60 * 1000,
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearCookies(res: express.Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
