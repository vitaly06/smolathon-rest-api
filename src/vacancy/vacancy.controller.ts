import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { ApiOperation } from '@nestjs/swagger';
import { SendResponseDto } from './dto/send-response.dto';

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

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.vacancyService.deleteVacancy(+id);
  }

  @ApiOperation({
    description: 'Отклик на вакансию',
  })
  @Post('send-response')
  async sendResponse(@Body() dto: SendResponseDto) {
    return await this.vacancyService.sendResponse(dto);
  }
}
