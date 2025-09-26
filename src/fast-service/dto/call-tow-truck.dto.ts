import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class callTowTruckDto {
  @IsString({ message: 'ФИО должно быть строкой' })
  @IsNotEmpty({ message: 'ФИО обязательно для заполнения' })
  fullName: string;
  @IsString({ message: 'Номер телефона должен быть строкой' })
  @IsNotEmpty({ message: 'Номер телефона обязателен для заполнения' })
  phoneNumber: string;
  @IsString({ message: 'Почта должна быть строкой' })
  @IsNotEmpty({ message: 'Почта обязательна для заполнения' })
  @IsEmail({}, { message: 'Неверный формат почты' })
  email: string;
  @IsString({ message: 'Тип машины должен быть строкой' })
  @IsNotEmpty({ message: 'Тип машины обязателен для заполнения' })
  carType: string;
  @IsString({ message: 'Адрес должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес обязателен для заполнения' })
  address: string;
}
