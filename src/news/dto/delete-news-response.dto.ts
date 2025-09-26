import { ApiProperty } from '@nestjs/swagger';

export class DeleteNewsResponseDto {
  @ApiProperty({ example: 'Новость успешно удалена' })
  message: string;
}
