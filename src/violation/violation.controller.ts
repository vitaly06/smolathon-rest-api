import { Body, Controller, Get, Post } from '@nestjs/common';
import { ViolationService } from './violation.service';
import { CreateViolationDto } from './dto/create-violation.dto';

@Controller('violation')
export class ViolationController {
  constructor(private readonly violationService: ViolationService) {}

  @Post('add-violation')
  async addViolation(@Body() dto: CreateViolationDto) {
    return await this.violationService.addViolation(dto);
  }

  @Get('find-all')
  async findAll() {
    return await this.violationService.findAll();
  }
}
