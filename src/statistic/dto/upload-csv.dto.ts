import { ApiProperty } from '@nestjs/swagger';

export class UploadCsvDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'CSV файл с данными статистики',
  })
  file: any;
}
