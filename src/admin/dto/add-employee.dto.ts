import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class AddEmployeeDto {
  @ApiProperty({
    description: 'Логин сотрудника',
    example: 'ivanov',
    minLength: 3,
  })
  @IsString({ message: 'Логин должен быть строкой' })
  @IsNotEmpty({ message: 'Логин обязателен для заполнения' })
  @MinLength(3, { message: 'Логин должен содержать минимум 3 символа' })
  login: string;

  @ApiProperty({
    description: 'Пароль сотрудника',
    example: 'securePassword123',
    minLength: 6,
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;

  @ApiProperty({
    description: 'Id роли',
    example: 2,
    minimum: 1,
  })
  @IsNumber({}, { message: 'Id роли должен быть числом' })
  @IsPositive({ message: 'Id роли должен быть положительным числом' })
  @IsInt({ message: 'Id роли должен быть целым числом' })
  @Type(() => Number)
  roleId: number;
}
