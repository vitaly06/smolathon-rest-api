import { ApiProperty } from '@nestjs/swagger';

export class ViolationResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор нарушения',
  })
  id: number;

  @ApiProperty({
    example: 'Превышение скорости',
    description: 'Тип нарушения',
  })
  type: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Дата и время нарушения',
  })
  date: string;

  @ApiProperty({
    example: 'г. Москва, ул. Ленина, д. 1',
    description: 'Адрес нарушения',
  })
  address: string;

  @ApiProperty({
    example: '2024-01-15T12:00:00.000Z',
    description: 'Дата создания записи',
  })
  createdAt: Date;
}
