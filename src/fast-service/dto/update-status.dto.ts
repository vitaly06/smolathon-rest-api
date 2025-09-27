import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { $Enums } from '@prisma/client';

// Используем Prisma enum вместо кастомного
export type ResponseStatus = $Enums.ResponseStatus;

export class UpdateStatusDto {
  @ApiProperty({
    description: 'ID заявки',
    example: 1,
    minimum: 1,
  })
  @IsInt({ message: 'ID заявки должен быть целым числом' })
  @IsPositive({ message: 'ID заявки должен быть положительным числом' })
  id: number;

  @ApiProperty({
    description: 'Новый статус заявки',
    enum: $Enums.ResponseStatus,
    example: $Enums.ResponseStatus.PROCCESS,
  })
  @IsEnum($Enums.ResponseStatus, { message: 'Неверный статус заявки' })
  status: $Enums.ResponseStatus;
}
