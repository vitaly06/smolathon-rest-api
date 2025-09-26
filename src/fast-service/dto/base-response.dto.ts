import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({
    example: 'Заявка успешно отправлена',
    description: 'Сообщение об успешной отправке заявки',
  })
  message: string;
}
