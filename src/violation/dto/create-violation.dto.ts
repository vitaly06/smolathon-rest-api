import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsISO8601 } from 'class-validator';

export class CreateViolationDto {
  @ApiProperty({
    description: 'Тип нарушения',
    example: 'Превышение скорости',
    required: true,
  })
  @IsString({ message: 'Тип нарушения должен быть строкой' })
  @IsNotEmpty({ message: 'Тип нарушения обязателен для заполнения' })
  type: string;

  @ApiProperty({
    description: 'Дата и время нарушения в формате ISO 8601',
    example: '2024-01-15T10:30:00.000Z',
    required: true,
  })
  @IsISO8601({}, { message: 'Дата должна быть в формате ISO 8601' })
  @IsNotEmpty({ message: 'Дата нарушения обязательна для заполнения' })
  date: string;

  @ApiProperty({
    description: 'Адрес нарушения',
    example: 'г. Москва, ул. Ленина, д. 1',
    required: true,
  })
  @IsString({ message: 'Адрес должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес нарушения обязателен для заполнения' })
  address: string;
}
