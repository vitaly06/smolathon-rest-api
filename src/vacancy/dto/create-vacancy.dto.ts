import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateVacancyDto {
  @IsString({ message: 'Название вакансии должно быть строкой' })
  @IsNotEmpty({ message: 'Название вакансии обязательно для заполнения' })
  title: string;
  @IsString({ message: 'Описание вакансии должно быть строкой' })
  @IsNotEmpty({ message: 'Описание вакансии обязательно для заполнения' })
  description: string;
  @IsString({ message: 'Адрес вакансии должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес вакансии обязателен для заполнения' })
  address: string;
  @IsNumber({}, { message: 'Заработная плата должна быть числом' })
  @IsInt({ message: 'Заработная плата должна быть целым числом' })
  @IsPositive({ message: 'Заработная плата должна быть положительным числом' })
  salary: number;
  @IsString({ message: 'Опыт работы должен быть строкой' })
  @IsNotEmpty({ message: 'Опыт работы обязателен для заполнения' })
  experience: string;
}
