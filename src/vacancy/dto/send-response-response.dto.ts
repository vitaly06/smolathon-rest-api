import { ApiProperty } from '@nestjs/swagger';

export class SendResponseResponseDto {
  @ApiProperty({ example: 'Заявка успешно отправлена в телеграм' })
  message: string;
}
