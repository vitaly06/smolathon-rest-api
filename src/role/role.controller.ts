import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary: 'Получение всех ролей',
  })
  @Get('find-all')
  async findAll() {
    return await this.roleService.findAll();
  }
}
