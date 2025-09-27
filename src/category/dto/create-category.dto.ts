import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Название категории',
    example: 'Техническая документация',
    minLength: 2,
  })
  @IsString({ message: 'Название категории должно быть строкой' })
  @IsNotEmpty({ message: 'Название категории обязательно для заполнения' })
  @MinLength(2, {
    message: 'Название категории должно содержать минимум 2 символа',
  })
  name: string;
}
