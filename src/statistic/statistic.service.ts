import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadCsvDto } from './dto/upload-csv.dto';

@Injectable()
export class StatisticService {
  constructor(private prisma: PrismaService) {}

  private parseValue(value: string): {
    numericValue: number | null;
    stringValue: string;
  } {
    if (!value) return { numericValue: null, stringValue: value };

    // Заменяем запятую на точку для парсинга чисел
    const normalizedValue = value.replace(',', '.');
    const numericValue = parseFloat(normalizedValue);

    return {
      numericValue: isNaN(numericValue) ? null : numericValue,
      stringValue: value,
    };
  }

  async saveSmolenskData(data: UploadCsvDto[]): Promise<void> {
    for (const item of data) {
      const values = this.parseValue(item.indicatorValue);

      await this.prisma.statistics.create({
        data: {
          subject: item.subject,
          pointFpsr: item.pointFpsr,
          indicatorName: item.indicatorName,
          indicatorValue: values.numericValue,
          indicatorValueString: values.stringValue,
          period: item.period,
        },
      });
    }
  }

  async getSmolenskData() {
    return this.prisma.statistics.findMany({
      where: {
        subject: {
          contains: 'Смоленская',
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
