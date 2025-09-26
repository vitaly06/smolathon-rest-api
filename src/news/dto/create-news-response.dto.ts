import { ApiProperty } from '@nestjs/swagger';
import { NewsResponseDto } from './news-response.dto';

export class CreateNewsResponseDto {
  @ApiProperty({ example: 'Новость успешно создана' })
  message: string;

  @ApiProperty({ type: NewsResponseDto })
  data: NewsResponseDto;
}
