import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { addEmployeeDto } from './dto/add-employee.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'Добавление нового сотрудника',
    description:
      'Создание учетной записи для нового сотрудника. Доступно только администраторам.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Сотрудник успешно создан',
    schema: {
      example: {
        id: 1,
        login: 'ivanov',

        roleId: 2,
        createdAt: '2024-01-01T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверные данные запроса',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Пользователь не авторизован',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Недостаточно прав (требуется роль администратора)',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Пользователь с таким логином уже существует',
  })
  @ApiBody({
    type: addEmployeeDto,
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
  @UseGuards(JwtAuthGuard)
  @Post('add-employee')
  async addEmployee(@Body() dto: addEmployeeDto) {
    return await this.adminService.addEmployee(
      dto.login,
      dto.password,
      dto.roleId,
    );
  }
}
