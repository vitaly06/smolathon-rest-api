import { ApiProperty } from '@nestjs/swagger';
import { ViolationResponseDto } from './violation-response.dto';

export class CreateViolationResponseDto {
  @ApiProperty({
    example: 'Нарушение успешно добавлено',
    description: 'Сообщение об успешном добавлении',
  })
  message: string;

  @ApiProperty({ type: ViolationResponseDto })
  data: ViolationResponseDto;
}
