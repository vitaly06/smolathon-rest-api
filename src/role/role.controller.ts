import { Controller, Get, HttpStatus } from '@nestjs/common';
import { RoleService } from './role.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { RoleResponseDto } from './dto/role-response.dto';

@ApiTags('Roles')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('find-all')
  @ApiOperation({
    summary: 'Получение всех ролей',
    description: 'Возвращает список всех доступных ролей в системе',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список ролей успешно получен',
    type: [RoleResponseDto],
    examples: {
      example1: {
        summary: 'Пример списка ролей',
        value: [
          { id: 1, name: 'ADMIN' },
          { id: 2, name: 'USER' },
          { id: 3, name: 'MODERATOR' },
        ],
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка сервера',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  async findAll(): Promise<RoleResponseDto[]> {
    return await this.roleService.findAll();
  }
}
