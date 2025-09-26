import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponseDto {
  @ApiProperty({
    example: 'Токены успешно обновлены',
    description: 'Сообщение об успешном обновлении токенов',
  })
  message: string;
}
