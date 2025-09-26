import { ApiProperty } from '@nestjs/swagger';

export class PeriodsResponseDto {
  @ApiProperty({
    type: [String],
    example: ['январь-апрель 2024 г.', 'май-декабрь 2024 г.'],
  })
  periods: string[];
}
