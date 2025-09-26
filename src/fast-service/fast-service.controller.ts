import { Body, Controller, Post } from '@nestjs/common';
import { FastServiceService } from './fast-service.service';
import { callTowTruckDto } from './dto/call-tow-truck.dto';
import { documentationDevelopmentDto } from './dto/documentation-development.dto';
import { BoomLiftRentalDto } from './dto/boom-lift-rental.dto';

@Controller('fast-service')
export class FastServiceController {
  constructor(private readonly fastServiceService: FastServiceService) {}

  @Post('call-tow-truck')
  async callTowTruck(@Body() dto: callTowTruckDto) {
    return await this.fastServiceService.callTowTruck(dto);
  }

  @Post('documentation-development')
  async documentationDevelopment(@Body() dto: documentationDevelopmentDto) {
    return await this.fastServiceService.documentationDevelopment(dto);
  }

  @Post('boom-lift-rental')
  async boomLiftRental(@Body() dto: BoomLiftRentalDto) {
    return await this.fastServiceService.boomLiftRental(dto);
  }
}
