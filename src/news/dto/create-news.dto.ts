import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({
    description: 'Заголовок новости',
    example: 'Новая дорога в Смоленске',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Текст новости',
    example: 'В Смоленске открывается новая автомобильная дорога...',
  })
  @IsString()
  @IsNotEmpty()
  body: string;
}
