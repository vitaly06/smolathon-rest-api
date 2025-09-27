import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SmolenskDataResponseDto,
  PeriodDataDto,
  IndicatorDto,
} from './dto/smolensk-data-response.dto';

@Injectable()
export class StatisticService {
  constructor(private prisma: PrismaService) {}

  async saveSmolenskData(data: any[]): Promise<void> {
    await this.prisma.statistics.createMany({
      data: data.map((d) => ({
        subject: d.subject,
        pointFpsr: d.pointFpsr,
        indicatorName: d.indicatorName,
        indicatorValue: parseFloat(d.indicatorValue.replace(',', '.')) || null,
        indicatorValueString: d.indicatorValue,
        period: d.period,
      })),
    });
  }

  async getSmolenskData() {
    return this.prisma.statistics.findMany({
      where: { subject: { contains: 'Смоленская' } },
    });
  }

  async getUniquePeriods(): Promise<string[]> {
    const periods = await this.prisma.statistics.findMany({
      select: { period: true },
      distinct: ['period'],
      orderBy: { period: 'desc' },
    });
    return periods.map((p) => p.period);
  }

  async getSmolenskDataForPeriod(
    year: string,
  ): Promise<SmolenskDataResponseDto> {
    const data = await this.prisma.statistics.findMany({
      where: {
        period: { contains: year },
        subject: { contains: 'Смоленская' },
      },
      orderBy: {
        period: 'asc',
      },
    });

    if (data.length === 0) {
      throw new NotFoundException('Данные не найдены');
    }

    // Группируем данные по периодам
    const dataByPeriod = data.reduce(
      (acc, item) => {
        if (!acc[item.period]) {
          acc[item.period] = [];
        }
        acc[item.period].push(item);
        return acc;
      },
      {} as Record<string, typeof data>,
    );

    // Преобразуем в нужный формат
    const periodData: PeriodDataDto[] = [];

    for (const periodStr in dataByPeriod) {
      const indicators: IndicatorDto[] = [];

      dataByPeriod[periodStr].forEach((item) => {
        let value: number | null = item.indicatorValue;

        // Если числовое значение null, пробуем распарсить из строки
        if (value === null && item.indicatorValueString) {
          const parsed = parseFloat(
            item.indicatorValueString.replace(',', '.'),
          );
          value = isNaN(parsed) ? null : parsed;
        }

        // Используем числовое значение или 0 если не удалось распарсить
        const finalValue = value ?? 0;

        indicators.push({
          name: item.indicatorName,
          value: finalValue,
        });
      });

      periodData.push({
        period: periodStr,
        indicators: indicators,
      });
    }

    return {
      data: periodData,
    };
  }

  // Дополнительный метод для получения всех данных без фильтрации по году
  async getAllSmolenskData(): Promise<SmolenskDataResponseDto> {
    const data = await this.prisma.statistics.findMany({
      where: {
        subject: { contains: 'Смоленская' },
      },
      orderBy: {
        period: 'asc',
      },
    });

    if (data.length === 0) {
      throw new NotFoundException('Данные не найдены');
    }

    const dataByPeriod = data.reduce(
      (acc, item) => {
        if (!acc[item.period]) {
          acc[item.period] = [];
        }
        acc[item.period].push(item);
        return acc;
      },
      {} as Record<string, typeof data>,
    );

    const periodData: PeriodDataDto[] = [];

    for (const periodStr in dataByPeriod) {
      const indicators: IndicatorDto[] = [];

      dataByPeriod[periodStr].forEach((item) => {
        let value: number | null = item.indicatorValue;

        if (value === null && item.indicatorValueString) {
          const parsed = parseFloat(
            item.indicatorValueString.replace(',', '.'),
          );
          value = isNaN(parsed) ? null : parsed;
        }

        const finalValue = value ?? 0;

        indicators.push({
          name: item.indicatorName,
          value: finalValue,
        });
      });

      periodData.push({
        period: periodStr,
        indicators: indicators,
      });
    }

    return {
      data: periodData,
    };
  }
}
