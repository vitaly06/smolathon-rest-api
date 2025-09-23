import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsString({ message: 'Логин должен быть строкой' })
  @IsNotEmpty({ message: 'Логин обязателен  для заполнения' })
  login: string;
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  password: string;
}
