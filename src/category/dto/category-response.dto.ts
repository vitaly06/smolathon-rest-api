import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор категории',
  })
  id: number;

  @ApiProperty({
    example: 'Техническая документация',
    description: 'Название категории',
  })
  name: string;
}
