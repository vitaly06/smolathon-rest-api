import { ApiProperty } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ivanov' })
  login: string;

  @ApiProperty({ example: 2 })
  roleId: number;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  updatedAt: Date;
}
