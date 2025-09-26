// fast-service/fast-service.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CallTowTruckDto } from './dto/call-tow-truck.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { DocumentationDevelopmentDto } from './dto/documentation-development.dto';
import { BoomLiftRentalDto } from './dto/boom-lift-rental.dto';
import { BaseResponseDto } from './dto/base-response.dto';

@Injectable()
export class FastServiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  async callTowTruck(dto: CallTowTruckDto): Promise<BaseResponseDto> {
    try {
      const response = await this.prisma.towTruckResponse.create({
        data: {
          ...dto,
        },
      });

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
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при создании заявки: ${error.message}`,
      );
    }
  }

  async documentationDevelopment(
    dto: DocumentationDevelopmentDto,
  ): Promise<BaseResponseDto> {
    try {
      const response =
        await this.prisma.documentationDevelopmentResponse.create({
          data: {
            ...dto,
          },
        });

      const message = `
*Новая заявка на разработку проектно-сметной документации*

*ФИО:* ${response.fullName}
*Телефон:* ${response.phoneNumber}
*Email:* ${response.email}
      `;

      await this.telegramBotService.sendJobResponseNotification(message);
      return { message: 'Заявка успешно отправлена' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при создании заявки: ${error.message}`,
      );
    }
  }

  async boomLiftRental(dto: BoomLiftRentalDto): Promise<BaseResponseDto> {
    try {
      const response = await this.prisma.boomLiftRentalResponse.create({
        data: {
          ...dto,
        },
      });

      const message = `
*Новая заявка на аренду автовышки*

*ФИО:* ${response.fullName}
*Телефон:* ${response.phoneNumber}
*Email:* ${response.email}
      `;

      await this.telegramBotService.sendJobResponseNotification(message);
      return { message: 'Заявка успешно отправлена' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при создании заявки: ${error.message}`,
      );
    }
  }
}
