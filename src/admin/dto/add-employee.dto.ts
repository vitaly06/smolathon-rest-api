import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class addEmployeeDto {
  @IsString({ message: 'Логин должен быть строкой' })
  @IsNotEmpty({ message: 'Логин обязателен  для заполнения' })
  login: string;
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  password: string;
  @IsNumber({}, { message: 'Id роли должен быть числом' })
  @IsPositive({ message: 'Id роли должен быть положительным числом' })
  @IsInt({ message: 'Id роли должен быть целым числом' })
  @Type(() => Number)
  roleId: number;
}
