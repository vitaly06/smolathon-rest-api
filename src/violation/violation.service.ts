import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateViolationDto } from './dto/create-violation.dto';
import { ViolationResponseDto } from './dto/violation-response.dto';
import { CreateViolationResponseDto } from './dto/create-violation-response.dto';

@Injectable()
export class ViolationService {
  constructor(private readonly prisma: PrismaService) {}

  async addViolation(
    dto: CreateViolationDto,
  ): Promise<CreateViolationResponseDto> {
    try {
      const violation = await this.prisma.violation.create({
        data: {
          type: dto.type,
          date: new Date(dto.date), // Преобразуем строку в Date
          address: dto.address,
        },
      });

      return {
        message: 'Нарушение успешно добавлено',
        data: this.transformViolation(violation),
      };
    } catch (error) {
      throw new BadRequestException(
        `Ошибка при добавлении нарушения: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<ViolationResponseDto[]> {
    try {
      const violations = await this.prisma.violation.findMany({
        orderBy: {
          createdAt: 'desc', // Сортировка по дате создания (новые сначала)
        },
      });

      return violations.map((violation) => this.transformViolation(violation));
    } catch (error) {
      throw new BadRequestException(
        `Ошибка при получении нарушений: ${error.message}`,
      );
    }
  }

  private transformViolation(violation: any): ViolationResponseDto {
    return {
      id: violation.id,
      type: violation.type,
      date: violation.date.toISOString(),
      address: violation.address,
      createdAt: violation.createdAt,
    };
  }
}
