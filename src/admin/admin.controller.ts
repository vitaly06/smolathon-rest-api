import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('add-employee')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Добавление нового сотрудника',
    description:
      'Создание учетной записи для нового сотрудника. Доступно только администраторам.',
  })
  @ApiBody({
    type: AddEmployeeDto,
    examples: {
      example1: {
        summary: 'Пример создания сотрудника',
        value: {
          login: 'ivanov',
          password: 'securePassword123',
          roleId: 2,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Сотрудник успешно создан',
    type: EmployeeResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные запроса',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Логин должен содержать минимум 3 символа',
          'Пароль должен содержать минимум 6 символов',
          'Id роли должен быть целым числом',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Пользователь не авторизован',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Недостаточно прав (требуется роль администратора)',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Пользователь с таким логином уже существует',
    schema: {
      example: {
        statusCode: 409,
        message: 'Пользователь с таким логином уже существует',
      },
    },
  })
  async addEmployee(@Body() dto: AddEmployeeDto): Promise<EmployeeResponseDto> {
    return await this.adminService.addEmployee(
      dto.login,
      dto.password,
      dto.roleId,
    );
  }
}
