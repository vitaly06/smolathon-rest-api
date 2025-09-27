import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CallTowTruckDto } from './dto/call-tow-truck.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { DocumentationDevelopmentDto } from './dto/documentation-development.dto';
import { BoomLiftRentalDto } from './dto/boom-lift-rental.dto';
import { BaseResponseDto } from './dto/base-response.dto';
import {
  TowTruckResponseDto,
  DocumentationResponseDto,
  BoomLiftResponseDto,
  JobResponseDto,
} from './dto/response-item.dto';
import { $Enums } from '@prisma/client';

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

  async updateTowTruckStatus(
    id: number,
    status: $Enums.ResponseStatus,
  ): Promise<BaseResponseDto> {
    try {
      const request = await this.prisma.towTruckResponse.findUnique({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException('Заявка на эвакуатор не найдена');
      }

      await this.prisma.towTruckResponse.update({
        where: { id },
        data: { status },
      });

      return { message: 'Статус заявки на эвакуатор успешно обновлен' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при обновлении статуса: ${error.message}`,
      );
    }
  }

  async updateDocumentationStatus(
    id: number,
    status: $Enums.ResponseStatus,
  ): Promise<BaseResponseDto> {
    try {
      const request =
        await this.prisma.documentationDevelopmentResponse.findUnique({
          where: { id },
        });

      if (!request) {
        throw new NotFoundException('Заявка на документацию не найдена');
      }

      await this.prisma.documentationDevelopmentResponse.update({
        where: { id },
        data: { status },
      });

      return { message: 'Статус заявки на документацию успешно обновлен' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при обновлении статуса: ${error.message}`,
      );
    }
  }

  async updateBoomLiftStatus(
    id: number,
    status: $Enums.ResponseStatus,
  ): Promise<BaseResponseDto> {
    try {
      const request = await this.prisma.boomLiftRentalResponse.findUnique({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException('Заявка на автовышку не найдена');
      }

      await this.prisma.boomLiftRentalResponse.update({
        where: { id },
        data: { status },
      });

      return { message: 'Статус заявки на автовышку успешно обновлен' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при обновлении статуса: ${error.message}`,
      );
    }
  }

  async updateJobResponseStatus(
    id: number,
    status: $Enums.ResponseStatus,
  ): Promise<BaseResponseDto> {
    try {
      const request = await this.prisma.jobResponse.findUnique({
        where: { id },
      });

      if (!request) {
        throw new NotFoundException('Отклик на вакансию не найден');
      }

      await this.prisma.jobResponse.update({
        where: { id },
        data: { status },
      });

      return { message: 'Статус отклика на вакансию успешно обновлен' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Ошибка при обновлении статуса: ${error.message}`,
      );
    }
  }

  async getAllTowTruckRequests(): Promise<TowTruckResponseDto[]> {
    const requests = await this.prisma.towTruckResponse.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return requests.map((request) => this.transformTowTruckResponse(request));
  }

  async getAllDocumentationRequests(): Promise<DocumentationResponseDto[]> {
    const requests =
      await this.prisma.documentationDevelopmentResponse.findMany({
        orderBy: {
          id: 'desc',
        },
      });

    return requests.map((request) =>
      this.transformDocumentationResponse(request),
    );
  }

  async getAllBoomLiftRequests(): Promise<BoomLiftResponseDto[]> {
    const requests = await this.prisma.boomLiftRentalResponse.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return requests.map((request) => this.transformBoomLiftResponse(request));
  }

  async getAllJobResponses(): Promise<JobResponseDto[]> {
    const responses = await this.prisma.jobResponse.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return responses.map((response) => this.transformJobResponse(response));
  }

  private transformTowTruckResponse(request: any): TowTruckResponseDto {
    return {
      id: request.id,
      fullName: request.fullName,
      phoneNumber: request.phoneNumber,
      email: request.email,
      carType: request.carType,
      address: request.address,
      status: request.status,
      createdAt: request.createdAt,
    };
  }

  private transformDocumentationResponse(
    request: any,
  ): DocumentationResponseDto {
    return {
      id: request.id,
      fullName: request.fullName,
      phoneNumber: request.phoneNumber,
      email: request.email,
      status: request.status,
      createdAt: request.createdAt,
    };
  }

  private transformBoomLiftResponse(request: any): BoomLiftResponseDto {
    return {
      id: request.id,
      fullName: request.fullName,
      phoneNumber: request.phoneNumber,
      email: request.email,
      status: request.status,
      createdAt: request.createdAt,
    };
  }

  private transformJobResponse(response: any): JobResponseDto {
    return {
      id: response.id,
      fullName: response.fullName,
      phoneNumber: response.phoneNumber,
      email: response.email,
      status: response.status,
      createdAt: response.createdAt,
    };
  }
}
