import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateVacancyDto {
  @ApiProperty({
    description: 'Название вакансии',
    example: 'Менеджер по продажам',
    minLength: 3,
  })
  @IsString({ message: 'Название вакансии должно быть строкой' })
  @IsNotEmpty({ message: 'Название вакансии обязательно для заполнения' })
  @MinLength(3, {
    message: 'Название вакансии должно содержать минимум 3 символа',
  })
  title: string;

  @ApiProperty({
    description: 'Описание вакансии',
    example: 'Мы ищем активного менеджера по продажам...',
    minLength: 10,
  })
  @IsString({ message: 'Описание вакансии должно быть строкой' })
  @IsNotEmpty({ message: 'Описание вакансии обязательно для заполнения' })
  @MinLength(10, {
    message: 'Описание вакансии должно содержать минимум 10 символов',
  })
  description: string;

  @ApiProperty({
    description: 'Адрес работы',
    example: 'г. Москва, ул. Ленина, д. 1',
  })
  @IsString({ message: 'Адрес вакансии должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес вакансии обязателен для заполнения' })
  address: string;

  @ApiProperty({
    description: 'Заработная плата',
    example: 50000,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Заработная плата должна быть числом' })
  @IsInt({ message: 'Заработная плата должна быть целым числом' })
  @IsPositive({ message: 'Заработная плата должна быть положительным числом' })
  salary: number;

  @ApiProperty({
    description: 'Требуемый опыт работы',
    example: 'От 1 года',
    required: false,
  })
  @IsString({ message: 'Опыт работы должен быть строкой' })
  @IsNotEmpty({ message: 'Опыт работы обязателен для заполнения' })
  experience: string;
}
