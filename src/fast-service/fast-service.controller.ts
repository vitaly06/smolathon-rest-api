import { Body, Controller, HttpStatus, Post, Get, Put } from '@nestjs/common';
import { FastServiceService } from './fast-service.service';
import { CallTowTruckDto } from './dto/call-tow-truck.dto';
import { DocumentationDevelopmentDto } from './dto/documentation-development.dto';
import { BoomLiftRentalDto } from './dto/boom-lift-rental.dto';
import { BaseResponseDto } from './dto/base-response.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  TowTruckResponseDto,
  DocumentationResponseDto,
  BoomLiftResponseDto,
} from './dto/response-item.dto';
import { $Enums } from '@prisma/client';

@ApiTags('Fast Services')
@Controller('fast-service')
export class FastServiceController {
  constructor(private readonly fastServiceService: FastServiceService) {}

  @Post('call-tow-truck')
  @ApiOperation({
    summary: 'Заявка на вызов эвакуатора',
    description: 'Создание заявки на вызов эвакуатора',
  })
  @ApiBody({
    type: CallTowTruckDto,
    examples: {
      example1: {
        summary: 'Пример заявки на эвакуатор',
        value: {
          fullName: 'Иванов Иван Иванович',
          phoneNumber: '+7 (999) 123-45-67',
          email: 'ivanov@example.com',
          carType: 'Легковой автомобиль',
          address: 'г. Москва, ул. Ленина, д. 1',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Заявка успешно создана',
    type: BaseResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные запроса',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'ФИО обязательно для заполнения',
          'Неверный формат почты',
          'Адрес обязателен для заполнения',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при отправке уведомления в Telegram',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error: Telegram API error',
        error: 'Internal Server Error',
      },
    },
  })
  async callTowTruck(@Body() dto: CallTowTruckDto): Promise<BaseResponseDto> {
    return await this.fastServiceService.callTowTruck(dto);
  }

  @Post('documentation-development')
  @ApiOperation({
    summary: 'Заявка на разработку документации',
    description: 'Создание заявки на разработку проектно-сметной документации',
  })
  @ApiBody({
    type: DocumentationDevelopmentDto,
    examples: {
      example1: {
        summary: 'Пример заявки на документацию',
        value: {
          fullName: 'Петров Петр Петрович',
          phoneNumber: '+7 (999) 987-65-43',
          email: 'petrov@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Заявка успешно создана',
    type: BaseResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные запроса',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Номер телефона обязателен для заполнения',
          'Неверный формат почты',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при отправке уведомления в Telegram',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error: Telegram API error',
        error: 'Internal Server Error',
      },
    },
  })
  async documentationDevelopment(
    @Body() dto: DocumentationDevelopmentDto,
  ): Promise<BaseResponseDto> {
    return await this.fastServiceService.documentationDevelopment(dto);
  }

  @Post('boom-lift-rental')
  @ApiOperation({
    summary: 'Заявка на аренду автовышки',
    description: 'Создание заявки на аренду автовышки',
  })
  @ApiBody({
    type: BoomLiftRentalDto,
    examples: {
      example1: {
        summary: 'Пример заявки на аренду автовышки',
        value: {
          fullName: 'Сидоров Алексей Владимирович',
          phoneNumber: '+7 (999) 555-44-33',
          email: 'sidorov@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Заявка успешно создана',
    type: BaseResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные запроса',
    schema: {
      example: {
        statusCode: 400,
        message: ['ФИО обязательно для заполнения', 'Неверный формат почты'],
        error: 'Bad Request',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Ошибка при отправке уведомления в Telegram',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error: Telegram API error',
        error: 'Internal Server Error',
      },
    },
  })
  async boomLiftRental(
    @Body() dto: BoomLiftRentalDto,
  ): Promise<BaseResponseDto> {
    return await this.fastServiceService.boomLiftRental(dto);
  }

  @Put('tow-truck/update-status')
  @ApiOperation({
    summary: 'Обновление статуса заявки на эвакуатор',
    description:
      'Обновление статуса заявки на вызов эвакуатора. Доступно только авторизованным пользователям.',
  })
  @ApiBody({
    type: UpdateStatusDto,
    examples: {
      example1: {
        summary: 'Пример обновления статуса',
        value: {
          id: 1,
          status: $Enums.ResponseStatus.PROCCESS, // Исправлено
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус заявки успешно обновлен',
    type: BaseResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные запроса',
  })
  @ApiNotFoundResponse({
    description: 'Заявка не найдена',
  })
  async updateTowTruckStatus(
    @Body() dto: UpdateStatusDto,
  ): Promise<BaseResponseDto> {
    return await this.fastServiceService.updateTowTruckStatus(
      dto.id,
      dto.status,
    );
  }

  @Put('documentation/update-status')
  @ApiOperation({
    summary: 'Обновление статуса заявки на документацию',
    description:
      'Обновление статуса заявки на разработку документации. Доступно только авторизованным пользователям.',
  })
  @ApiBody({
    type: UpdateStatusDto,
    examples: {
      example1: {
        summary: 'Пример обновления статуса',
        value: {
          id: 1,
          status: $Enums.ResponseStatus.SOLVED, // Исправлено
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус заявки успешно обновлен',
    type: BaseResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные запроса',
  })
  @ApiNotFoundResponse({
    description: 'Заявка не найдена',
  })
  async updateDocumentationStatus(
    @Body() dto: UpdateStatusDto,
  ): Promise<BaseResponseDto> {
    return await this.fastServiceService.updateDocumentationStatus(
      dto.id,
      dto.status,
    );
  }

  @Put('boom-lift/update-status')
  @ApiOperation({
    summary: 'Обновление статуса заявки на автовышку',
    description:
      'Обновление статуса заявки на аренду автовышки. Доступно только авторизованным пользователям.',
  })
  @ApiBody({
    type: UpdateStatusDto,
    examples: {
      example1: {
        summary: 'Пример обновления статуса',
        value: {
          id: 1,
          status: $Enums.ResponseStatus.PROCCESS, // Исправлено
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус заявки успешно обновлен',
    type: BaseResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные запроса',
  })
  @ApiNotFoundResponse({
    description: 'Заявка не найдена',
  })
  async updateBoomLiftStatus(
    @Body() dto: UpdateStatusDto,
  ): Promise<BaseResponseDto> {
    return await this.fastServiceService.updateBoomLiftStatus(
      dto.id,
      dto.status,
    );
  }

  @Get('tow-truck/all')
  @ApiOperation({
    summary: 'Получение всех заявок на эвакуатор',
    description:
      'Возвращает список всех заявок на вызов эвакуатора. Доступно только авторизованным пользователям.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список заявок успешно получен',
    type: [TowTruckResponseDto],
  })
  async getAllTowTruckRequests(): Promise<TowTruckResponseDto[]> {
    return await this.fastServiceService.getAllTowTruckRequests();
  }

  @Get('documentation/all')
  @ApiOperation({
    summary: 'Получение всех заявок на документацию',
    description:
      'Возвращает список всех заявок на разработку документации. Доступно только авторизованным пользователям.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список заявок успешно получен',
    type: [DocumentationResponseDto],
  })
  async getAllDocumentationRequests(): Promise<DocumentationResponseDto[]> {
    return await this.fastServiceService.getAllDocumentationRequests();
  }

  @Get('boom-lift/all')
  @ApiOperation({
    summary: 'Получение всех заявок на автовышку',
    description:
      'Возвращает список всех заявок на аренду автовышки. Доступно только авторизованным пользователям.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список заявок успешно получен',
    type: [BoomLiftResponseDto],
  })
  async getAllBoomLiftRequests(): Promise<BoomLiftResponseDto[]> {
    return await this.fastServiceService.getAllBoomLiftRequests();
  }

  @Get('job-responses/all')
  @ApiOperation({
    summary: 'Получение всех откликов на вакансии',
    description:
      'Возвращает список всех откликов на вакансии. Доступно только авторизованным пользователям.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список откликов успешно получен',
    type: [DocumentationResponseDto],
  })
  async getAllJobResponses(): Promise<any[]> {
    return await this.fastServiceService.getAllJobResponses();
  }

  @Put('job-response/update-status')
  @ApiOperation({
    summary: 'Обновление статуса отклика на вакансию',
    description:
      'Обновление статуса отклика на вакансию. Доступно только авторизованным пользователям.',
  })
  @ApiBody({
    type: UpdateStatusDto,
    examples: {
      example1: {
        summary: 'Пример обновления статуса',
        value: {
          id: 1,
          status: $Enums.ResponseStatus.PROCCESS, // Исправлено
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Статус отклика успешно обновлен',
    type: BaseResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные запроса',
  })
  @ApiNotFoundResponse({
    description: 'Отклик не найден',
  })
  async updateJobResponseStatus(
    @Body() dto: UpdateStatusDto,
  ): Promise<BaseResponseDto> {
    return await this.fastServiceService.updateJobResponseStatus(
      dto.id,
      dto.status,
    );
  }
}
