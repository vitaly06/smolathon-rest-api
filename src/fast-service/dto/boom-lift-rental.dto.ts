import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BoomLiftRentalDto {
  @ApiProperty({
    description: 'ФИО',
    example: 'Сидоров Алексей Владимирович',
  })
  @IsString({ message: 'ФИО должно быть строкой' })
  @IsNotEmpty({ message: 'ФИО обязательно для заполнения' })
  fullName: string;

  @ApiProperty({
    description: 'Номер телефона',
    example: '+7 (999) 555-44-33',
  })
  @IsString({ message: 'Номер телефона должен быть строкой' })
  @IsNotEmpty({ message: 'Номер телефона обязателен для заполнения' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Email',
    example: 'sidorov@example.com',
  })
  @IsString({ message: 'Почта должна быть строкой' })
  @IsNotEmpty({ message: 'Почта обязательна для заполнения' })
  @IsEmail({}, { message: 'Неверный формат почты' })
  email: string;
}
