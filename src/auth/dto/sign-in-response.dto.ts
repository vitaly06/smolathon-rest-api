import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({
    example: 'Вы успешно авторизовались',
    description: 'Сообщение об успешной авторизации',
  })
  message: string;
}
