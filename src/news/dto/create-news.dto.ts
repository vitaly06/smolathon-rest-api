import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({
    description: 'Заголовок новости',
    example: 'Новая дорога в Смоленске',
  })
  @IsString({ message: 'Заголовок должен быть строкой' })
  @IsNotEmpty({ message: 'Заголовок обязателен для заполнения' })
  title: string;

  @ApiProperty({
    description: 'Текст новости',
    example: 'В Смоленске открывается новая автомобильная дорога...',
  })
  @IsString({ message: 'Текст новости должен быть строкой' })
  @IsNotEmpty({ message: 'Текст новости обязателен для заполнения' })
  body: string;
}
