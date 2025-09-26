import { ApiProperty } from '@nestjs/swagger';

export class VacancyResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Менеджер по продажам' })
  title: string;

  @ApiProperty({ example: 'Описание вакансии...' })
  description: string;

  @ApiProperty({ example: 'г. Москва, ул. Ленина, д. 1' })
  address: string;

  @ApiProperty({ example: 50000 })
  salary: number;

  @ApiProperty({ example: 'От 1 года', nullable: true })
  experience?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 1, nullable: true })
  userId?: number;
}
