import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

@Injectable()
export class VacancyService {
  constructor(private readonly prisma: PrismaService) {}

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
}
