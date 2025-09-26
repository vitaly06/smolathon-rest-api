import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { SendResponseDto } from './dto/send-response.dto';
import { TelegramBotService } from 'src/telegram-bot/telegram-bot.service';

@Injectable()
export class VacancyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  async createVacancy(dto: CreateVacancyDto) {
    const { title, description, address, salary, experience } = { ...dto };

    await this.prisma.vacancy.create({
      data: {
        title,
        description,
        address,
        salary,
        experience,
      },
    });

    return { message: 'Вакансия успешно создана' };
  }

  async findAll() {
    return await this.prisma.vacancy.findMany();
  }

  async deleteVacancy(id: number) {
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

  async sendResponse(dto: SendResponseDto) {
    const { fullName, phoneNumber, email } = { ...dto };

    const response = await this.prisma.jobResponse.create({
      data: {
        fullName,
        phoneNumber,
        email,
      },
    });

    try {
      const vacancy = await this.prisma.vacancy.findUnique({
        where: { id: dto.vacancyId },
      });
      const message = `
*Новая заявка на вакансию*

*Вакансия:* ${vacancy?.title}
*ФИО:* ${response.fullName}
*Телефон:* ${response.phoneNumber}
*Email:* ${response.email}
            `;
      await this.telegramBotService.sendJobResponseNotification(message);

      return { message: 'Заявка успешна отправлена в телеграм' };
    } catch (e) {
      throw new BadRequestException('Error:', e);
    }
  }
}
