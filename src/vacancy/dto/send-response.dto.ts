import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class SendResponseDto {
  @ApiProperty()
  @IsString({ message: 'ФИО должно быть строкой' })
  @IsNotEmpty({ message: 'ФИО обязательно для заполнения' })
  fullName: string;
  @ApiProperty()
  @IsString({ message: 'Номер телефона должен быть строкой' })
  @IsNotEmpty({ message: 'Номер телефона обязателен для заполнения' })
  phoneNumber: string;
  @ApiProperty()
  @IsString({ message: 'Почт должна быть строкой' })
  @IsNotEmpty({ message: 'Почта обязательна для заполнения' })
  @IsEmail({}, { message: 'Неверный формат почты' })
  email: string;
  @ApiProperty()
  @Type(() => Number)
  @IsInt({ message: 'Id вакансии должен быть целым числом' })
  @IsNumber({}, { message: 'Id вакансии должен быть числом' })
  @IsPositive({ message: 'Id вакансии должен быть положительным числом' })
  vacancyId: number;
}
