import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { FastServiceService } from './fast-service.service';
import { CallTowTruckDto } from './dto/call-tow-truck.dto';
import { DocumentationDevelopmentDto } from './dto/documentation-development.dto';
import { BoomLiftRentalDto } from './dto/boom-lift-rental.dto';
import { BaseResponseDto } from './dto/base-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

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
}
