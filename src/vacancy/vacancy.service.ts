import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { SendResponseDto } from './dto/send-response.dto';
import { TelegramBotService } from '../telegram-bot/telegram-bot.service';
import { CreateVacancyResponseDto } from './dto/create-vacancy-response.dto';
import { DeleteVacancyResponseDto } from './dto/delete-vacancy-response.dto';
import { SendResponseResponseDto } from './dto/send-response-response.dto';
import { VacancyResponseDto } from './dto/vacancy-response.dto';

@Injectable()
export class VacancyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  async createVacancy(
    dto: CreateVacancyDto,
  ): Promise<CreateVacancyResponseDto> {
    await this.prisma.vacancy.create({
      data: {
        title: dto.title,
        description: dto.description,
        address: dto.address,
        salary: dto.salary,
        experience: dto.experience,
      },
    });

    return { message: 'Вакансия успешно создана' };
  }

  async findAll(): Promise<VacancyResponseDto[]> {
    const vacancies = await this.prisma.vacancy.findMany({
      orderBy: {
        id: 'desc', // Исправлено: используем id вместо createdAt
      },
    });

    return vacancies.map((vacancy) => this.transformVacancy(vacancy));
  }

  async deleteVacancy(id: number): Promise<DeleteVacancyResponseDto> {
    const checkVacancy = await this.prisma.vacancy.findUnique({
      where: { id },
    });

    if (!checkVacancy) {
      throw new NotFoundException('Вакансии с таким id не найдено');
    }

    await this.prisma.vacancy.delete({
      where: { id },
    });

    return { message: 'Вакансия успешно удалена' };
  }

  async sendResponse(dto: SendResponseDto): Promise<SendResponseResponseDto> {
    // Проверяем существование вакансии
    const vacancy = await this.prisma.vacancy.findUnique({
      where: { id: dto.vacancyId },
    });

    if (!vacancy) {
      throw new NotFoundException('Вакансия с указанным ID не найдена');
    }

    const response = await this.prisma.jobResponse.create({
      data: {
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        email: dto.email,
      },
    });

    try {
      const message = `
*Новая заявка на вакансию*

*Вакансия:* ${vacancy.title}
*ФИО:* ${response.fullName}
*Телефон:* ${response.phoneNumber}
*Email:* ${response.email}
      `;

      await this.telegramBotService.sendJobResponseNotification(message);

      return { message: 'Заявка успешно отправлена в телеграм' };
    } catch (error) {
      throw new BadRequestException(
        `Ошибка при отправке уведомления: ${error.message}`,
      );
    }
  }

  private transformVacancy(vacancy: any): VacancyResponseDto {
    return {
      id: vacancy.id,
      title: vacancy.title,
      description: vacancy.description,
      address: vacancy.address,
      salary: vacancy.salary,
      experience: vacancy.experience || undefined,
      createdAt: vacancy.createdAt,
      userId: vacancy.userId || undefined,
    };
  }
}
