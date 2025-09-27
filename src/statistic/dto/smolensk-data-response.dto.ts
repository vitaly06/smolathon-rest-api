import { ApiProperty } from '@nestjs/swagger';

export class IndicatorDto {
  @ApiProperty({ example: 'Количество ДТП с пострадавшими' })
  name: string;

  @ApiProperty({ example: 167 })
  value: number;
}

export class PeriodDataDto {
  @ApiProperty({ example: 'январь-апрель 2024 г.' })
  period: string;

  @ApiProperty({ type: [IndicatorDto] })
  indicators: IndicatorDto[];
}

export class SmolenskDataResponseDto {
  @ApiProperty({ type: [PeriodDataDto] })
  data: PeriodDataDto[];
}
