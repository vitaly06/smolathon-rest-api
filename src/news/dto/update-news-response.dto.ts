import { ApiProperty } from '@nestjs/swagger';
import { NewsResponseDto } from './news-response.dto';

export class UpdateNewsResponseDto {
  @ApiProperty({ example: 'Новость успешно обновлена' })
  message: string;

  @ApiProperty({ type: NewsResponseDto })
  data: NewsResponseDto;
}
