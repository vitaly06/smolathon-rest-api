import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { VacancyService } from './vacancy.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { SendResponseDto } from './dto/send-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { VacancyResponseDto } from './dto/vacancy-response.dto';
import { CreateVacancyResponseDto } from './dto/create-vacancy-response.dto';
import { DeleteVacancyResponseDto } from './dto/delete-vacancy-response.dto';
import { SendResponseResponseDto } from './dto/send-response-response.dto';

@ApiTags('Vacancies')
@Controller('vacancy')
export class VacancyController {
  constructor(private readonly vacancyService: VacancyService) {}

  @Post('create-vacancy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создание новой вакансии',
    description:
      'Создание вакансии. Доступно только авторизованным пользователям.',
  })
  @ApiBody({
    type: CreateVacancyDto,
    examples: {
      example1: {
        summary: 'Пример создания вакансии',
        value: {
          title: 'Менеджер по продажам',
          description: 'Мы ищем активного менеджера по продажам...',
          address: 'г. Москва, ул. Ленина, д. 1',
          salary: 50000,
          experience: 'От 1 года',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Вакансия успешно создана',
    type: CreateVacancyResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные запроса',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Название вакансии обязательно для заполнения',
          'Заработная плата должна быть положительным числом',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка сервера',
  })
  async createVacancy(
    @Body() dto: CreateVacancyDto,
  ): Promise<CreateVacancyResponseDto> {
    return await this.vacancyService.createVacancy(dto);
  }

  @Get('find-all')
  @ApiOperation({
    summary: 'Получение всех вакансий',
    description: 'Возвращает список всех активных вакансий',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список вакансий успешно получен',
    type: [VacancyResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка сервера',
  })
  async findAll(): Promise<VacancyResponseDto[]> {
    return await this.vacancyService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удаление вакансии',
    description:
      'Удаление вакансии по ID. Доступно только авторизованным пользователям.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID вакансии',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Вакансия успешно удалена',
    type: DeleteVacancyResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверный ID вакансии',
    schema: {
      example: {
        statusCode: 400,
        message: 'Неверный ID вакансии',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Вакансия не найдена',
    schema: {
      example: {
        statusCode: 404,
        message: 'Вакансии с таким id не найдено',
        error: 'Not Found',
      },
    },
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteVacancyResponseDto> {
    return await this.vacancyService.deleteVacancy(id);
  }

  @Post('send-response')
  @ApiOperation({
    summary: 'Отклик на вакансию',
    description: 'Отправка отклика на вакансию',
  })
  @ApiBody({
    type: SendResponseDto,
    examples: {
      example1: {
        summary: 'Пример отклика на вакансию',
        value: {
          fullName: 'Иванов Иван Иванович',
          phoneNumber: '+7 (999) 123-45-67',
          email: 'ivanov@example.com',
          vacancyId: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Заявка успешно отправлена',
    type: SendResponseResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные запроса',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'ФИО обязательно для заполнения',
          'Неверный формат почты',
          'Вакансия с указанным ID не найдена',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Вакансия не найдена',
  })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при отправке уведомления в Telegram',
  })
  async sendResponse(
    @Body() dto: SendResponseDto,
  ): Promise<SendResponseResponseDto> {
    return await this.vacancyService.sendResponse(dto);
  }
}
