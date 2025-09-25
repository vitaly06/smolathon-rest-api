import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-vacancy')
  async createVacancy(@Body() dto: CreateVacancyDto) {
    return await this.vacancyService.createVacancy(dto);
  }

  @Get('find-all')
  async findAll() {
    return await this.vacancyService.findAll();
  }
}
