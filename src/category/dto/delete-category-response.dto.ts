import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryResponseDto {
  @ApiProperty({
    example: 'Категория успешно удалена',
    description: 'Сообщение об успешном удалении категории',
  })
  message: string;
}
