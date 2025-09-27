import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

export class TowTruckResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Иванов Иван Иванович' })
  fullName: string;

  @ApiProperty({ example: '+7 (999) 123-45-67' })
  phoneNumber: string;

  @ApiProperty({ example: 'ivanov@example.com' })
  email: string;

  @ApiProperty({ example: 'Легковой автомобиль' })
  carType: string;

  @ApiProperty({ example: 'г. Москва, ул. Ленина, д. 1' })
  address: string;

  @ApiProperty({
    enum: $Enums.ResponseStatus,
    example: $Enums.ResponseStatus.NOT_RESOLVED,
  })
  status: $Enums.ResponseStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}

export class DocumentationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Петров Петр Петрович' })
  fullName: string;

  @ApiProperty({ example: '+7 (999) 987-65-43' })
  phoneNumber: string;

  @ApiProperty({ example: 'petrov@example.com' })
  email: string;

  @ApiProperty({
    enum: $Enums.ResponseStatus,
    example: $Enums.ResponseStatus.NOT_RESOLVED,
  })
  status: $Enums.ResponseStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}

export class BoomLiftResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Сидоров Алексей Владимирович' })
  fullName: string;

  @ApiProperty({ example: '+7 (999) 555-44-33' })
  phoneNumber: string;

  @ApiProperty({ example: 'sidorov@example.com' })
  email: string;

  @ApiProperty({
    enum: $Enums.ResponseStatus,
    example: $Enums.ResponseStatus.NOT_RESOLVED,
  })
  status: $Enums.ResponseStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}

export class JobResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Иванов Иван Иванович' })
  fullName: string;

  @ApiProperty({ example: '+7 (999) 123-45-67' })
  phoneNumber: string;

  @ApiProperty({ example: 'ivanov@example.com' })
  email: string;

  @ApiProperty({
    enum: $Enums.ResponseStatus,
    example: $Enums.ResponseStatus.NOT_RESOLVED,
  })
  status: $Enums.ResponseStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;
}
