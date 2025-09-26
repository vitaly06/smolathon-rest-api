import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SmolenskDataResponseDto } from './dto/smolensk-data-response.dto';

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
    });

    if (data.length === 0) {
      throw new NotFoundException('Данные не найдены');
    }

    const dataByPeriod = data.reduce(
      (acc, item) => {
        if (!acc[item.period]) acc[item.period] = [];
        acc[item.period].push(item);
        return acc;
      },
      {} as Record<string, typeof data>,
    );

    const result: SmolenskDataResponseDto = {};
    const russianMonths = [
      'январь',
      'февраль',
      'март',
      'апрель',
      'май',
      'июнь',
      'июль',
      'август',
      'сентябрь',
      'октябрь',
      'ноябрь',
      'декабрь',
    ];

    for (const periodStr in dataByPeriod) {
      const match = periodStr.match(/([а-я]+)-([а-я]+) (\d+) г\./);
      if (!match) continue;

      const startMonth = match[1];
      const endMonth = match[2];
      const pYear = match[3];

      const startIdx = russianMonths.indexOf(startMonth);
      const endIdx = russianMonths.indexOf(endMonth);

      if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) continue;

      const numMonths = endIdx - startIdx + 1;

      const indicators: Record<string, number> = {};
      dataByPeriod[periodStr].forEach((item) => {
        let value: number | null = item.indicatorValue;
        if (value === null && item.indicatorValueString) {
          const parsed = parseFloat(
            item.indicatorValueString.replace(',', '.'),
          );
          value = isNaN(parsed) ? null : parsed;
        }
        const finalValue = value ?? 0;
        indicators[item.indicatorName] = finalValue / numMonths;
      });

      const indicatorArray = Object.entries(indicators).map(
        ([name, value]) => ({
          name,
          value,
        }),
      );

      for (let i = startIdx; i <= endIdx; i++) {
        const monthKey = `${russianMonths[i]} ${pYear}`;
        result[monthKey] = indicatorArray;
      }
    }

    return result;
  }
}
