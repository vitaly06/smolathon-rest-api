import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CallTowTruckDto {
  @ApiProperty({
    description: 'ФИО',
    example: 'Иванов Иван Иванович',
  })
  @IsString({ message: 'ФИО должно быть строкой' })
  @IsNotEmpty({ message: 'ФИО обязательно для заполнения' })
  fullName: string;

  @ApiProperty({
    description: 'Номер телефона',
    example: '+7 (999) 123-45-67',
  })
  @IsString({ message: 'Номер телефона должен быть строкой' })
  @IsNotEmpty({ message: 'Номер телефона обязателен для заполнения' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Email',
    example: 'ivanov@example.com',
  })
  @IsString({ message: 'Почта должна быть строкой' })
  @IsNotEmpty({ message: 'Почта обязательна для заполнения' })
  @IsEmail({}, { message: 'Неверный формат почты' })
  email: string;

  @ApiProperty({
    description: 'Тип автомобиля',
    example: 'Легковой автомобиль',
  })
  @IsString({ message: 'Тип машины должен быть строкой' })
  @IsNotEmpty({ message: 'Тип машины обязателен для заполнения' })
  carType: string;

  @ApiProperty({
    description: 'Адрес подачи эвакуатора',
    example: 'г. Москва, ул. Ленина, д. 1',
  })
  @IsString({ message: 'Адрес должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес обязателен для заполнения' })
  address: string;
}
