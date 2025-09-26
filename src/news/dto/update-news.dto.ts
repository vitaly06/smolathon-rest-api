import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNewsDto {
  @ApiProperty({
    description: 'Заголовок новости',
    example: 'Обновленный заголовок',
    required: false,
  })
  @IsString({ message: 'Заголовок должен быть строкой' })
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Текст новости',
    example: 'Обновленный текст новости...',
    required: false,
  })
  @IsString({ message: 'Текст новости должен быть строкой' })
  @IsOptional()
  body?: string;
}
