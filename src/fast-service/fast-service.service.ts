import { BadRequestException, Body, Injectable, Post } from '@nestjs/common';
import { callTowTruckDto } from './dto/call-tow-truck.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';
import { documentationDevelopmentDto } from './dto/documentation-development.dto';
import { BoomLiftRentalDto } from './dto/boom-lift-rental.dto';

@Injectable()
export class FastServiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  async callTowTruck(dto: callTowTruckDto) {
    const response = await this.prisma.towTruckResponse.create({
      data: {
        ...dto,
      },
    });
    try {
      const message = `
*Новая заявка на вызов эвакуатора*

*ФИО:* ${response.fullName}
*Телефон:* ${response.phoneNumber}
*Email:* ${response.email}
*Тип автомобиля:* ${response.carType}
*Адрес:* ${response.address}
            `;
      await this.telegramBotService.sendJobResponseNotification(message);
      return { message: 'Заявка успешно отправлена' };
    } catch (e) {
      throw new BadRequestException(`Error: ${e}`);
    }
  }

  async documentationDevelopment(dto: documentationDevelopmentDto) {
    const response = await this.prisma.documentationDevelopmentResponse.create({
      data: {
        ...dto,
      },
    });

    try {
      const message = `
*Новая заявка на разработку проектно-сметной документации*

*ФИО:* ${response.fullName}
*Телефон:* ${response.phoneNumber}
*Email:* ${response.email}
            `;
      await this.telegramBotService.sendJobResponseNotification(message);
      return { message: 'Заявка успешно отправлена' };
    } catch (e) {
      throw new BadRequestException(`Error: ${e}`);
    }
  }

  async boomLiftRental(dto: BoomLiftRentalDto) {
    const response = await this.prisma.boomLiftRentalResponse.create({
      data: {
        ...dto,
      },
    });

    try {
      const message = `
*Новая заявка на аренду автовышки*

*ФИО:* ${response.fullName}
*Телефон:* ${response.phoneNumber}
*Email:* ${response.email}
            `;
      await this.telegramBotService.sendJobResponseNotification(message);
      return { message: 'Заявка успешно отправлена' };
    } catch (e) {
      throw new BadRequestException(`Error: ${e}`);
    }
  }
}
