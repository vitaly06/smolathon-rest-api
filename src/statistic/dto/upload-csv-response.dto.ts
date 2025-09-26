import { ApiProperty } from '@nestjs/swagger';

export class CsvDataItemDto {
  @ApiProperty({ example: 'Смоленская область' })
  subject: string;

  @ApiProperty({ example: '3_1' })
  pointFpsr: string;

  @ApiProperty({ example: 'Количество ДТП с пострадавшими' })
  indicatorName: string;

  @ApiProperty({ example: '167' })
  indicatorValue: string;

  @ApiProperty({ example: 'январь-апрель 2024 г.' })
  period: string;
}

export class UploadCsvResponseDto {
  @ApiProperty({ example: 'Данные Смоленской области успешно загружены' })
  message: string;

  @ApiProperty({ example: 50 })
  totalRows: number;

  @ApiProperty({ example: 4 })
  smolenskRows: number;

  @ApiProperty({ type: [CsvDataItemDto] })
  data: CsvDataItemDto[];
}
