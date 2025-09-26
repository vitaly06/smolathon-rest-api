import { ApiProperty } from '@nestjs/swagger';

export class IndicatorDto {
  @ApiProperty({ example: 'Количество ДТП с пострадавшими' })
  name: string;

  @ApiProperty({ example: 41.75 })
  value: number;
}

export class SmolenskDataResponseDto {
  [key: string]: IndicatorDto[];
}
