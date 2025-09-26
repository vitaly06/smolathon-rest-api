import { ApiProperty } from '@nestjs/swagger';

export class NewsResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Заголовок новости' })
  title: string;

  @ApiProperty({ example: 'Текст новости...' })
  body: string;

  @ApiProperty({
    example: 'http://localhost:3000/uploads/news/image.jpg',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '1 января 2024' })
  formattedDate: string;

  @ApiProperty({ example: 1, nullable: true })
  userId: number | null;
}
