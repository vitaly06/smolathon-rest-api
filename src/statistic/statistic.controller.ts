import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import type { Express } from 'express';
import { Readable } from 'stream';
import csv from 'csv-parser';
import { StatisticService } from './statistic.service';

interface CsvRow {
  subject?: string;
  pointFpsr?: string;
  indicatorName?: string;
  indicatorValue?: string;
}

@ApiTags('Statistics')
@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticsService: StatisticService) {}

  @Post('upload-csv')
  @ApiOperation({
    summary: 'Загрузка CSV файла с данными статистики',
    description:
      'Загружает CSV файл и сохраняет данные по Смоленской области в базу данных',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'CSV файл с данными статистики дорожно-транспортных происшествий',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            'CSV файл в формате: Субъект, Пункт ФПСР, Наименование показателя, Значение показателя',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Данные успешно загружены и обработаны',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Данные Смоленской области успешно загружены',
        },
        totalRows: { type: 'number', example: 50 },
        smolenskRows: { type: 'number', example: 4 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              subject: { type: 'string', example: 'Смоленская область' },
              pointFpsr: { type: 'string', example: '3_1' },
              indicatorName: {
                type: 'string',
                example: 'Количество ДТП с пострадавшими',
              },
              indicatorValue: { type: 'string', example: '167' },
              period: { type: 'string', example: 'январь-апрель 2024 г.' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации файла или обработки данных',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Ошибка обработки CSV файла: ...' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 413,
    description: 'Файл слишком большой',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 413 },
        message: { type: 'string', example: 'File too large' },
        error: { type: 'string', example: 'Payload Too Large' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 15 }), // 15MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      if (!file.originalname.toLowerCase().endsWith('.csv')) {
        throw new BadRequestException('Файл должен иметь расширение .csv');
      }
      const results = await this.parseCsvFile(file.buffer);

      // Фильтруем данные по Смоленской области
      const smolenskData = results.filter(
        (row) =>
          row.subject && row.subject.toLowerCase().includes('смоленская'),
      );

      if (smolenskData.length === 0) {
        return {
          message: 'Файл загружен, но данные по Смоленской области не найдены',
          totalRows: results.length,
          smolenskRows: 0,
        };
      }

      // Сохраняем данные Смоленской области
      await this.statisticsService.saveSmolenskData(smolenskData);

      return {
        message: 'Данные Смоленской области успешно загружены',
        totalRows: results.length,
        smolenskRows: smolenskData.length,
        data: smolenskData,
      };
    } catch (error) {
      throw new BadRequestException(
        `Ошибка обработки CSV файла: ${error.message}`,
      );
    }
  }

  @Get('smolensk')
  @ApiOperation({
    summary: 'Получение данных по Смоленской области',
    description:
      'Возвращает статистические данные по Смоленской области, группированные по месяцам для указанного года. По умолчанию - текущий год. Данные усредняются по месяцам в периоде.',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'Год для фильтрации данных (по умолчанию текущий год)',
    example: '2024',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное получение данных',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Количество ДТП с пострадавшими' },
            value: { type: 'number', example: 41.75 },
          },
        },
      },
      example: {
        'январь 2024': [
          { name: 'Количество ДТП с пострадавшими', value: 41.75 },
          { name: 'Другой показатель', value: 10.5 },
        ],
        'февраль 2024': [
          { name: 'Количество ДТП с пострадавшими', value: 41.75 },
          { name: 'Другой показатель', value: 10.5 },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Неверный формат периода',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example:
            'Неверный формат периода. Ожидается год, например, 2024 или период с годом.',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Данные по Смоленской области не найдены',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Данные не найдены' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async getSmolenskData(@Query('period') period?: string) {
    let year = new Date().getFullYear().toString();
    if (period) {
      const match = period.match(/\d{4}/);
      if (match) {
        year = match[0];
      } else {
        throw new BadRequestException(
          'Неверный формат периода. Ожидается год, например, 2024 или период с годом.',
        );
      }
    }
    return this.statisticsService.getSmolenskDataForPeriod(year);
  }

  @Get('periods')
  @ApiOperation({
    summary: 'Получение списка доступных периодов',
    description:
      'Возвращает уникальные периоды из базы данных для выбора в интерфейсе',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное получение периодов',
    schema: {
      type: 'array',
      items: { type: 'string', example: 'январь-апрель 2024 г.' },
    },
  })
  async getPeriods() {
    return this.statisticsService.getUniquePeriods();
  }

  private parseCsvFile(buffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const csvString = buffer.toString('utf-8');
      const lines = csvString.split(/\r?\n/); // Разделяем на строки
      if (lines.length === 0) {
        return reject(new Error('Пустой файл'));
      }

      // Первая строка - заголовки
      const firstLine = lines[0].trim();
      const headers = firstLine
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((h) => h.replace(/"/g, '').trim()); // Простой парсер заголовков с учётом кавычек

      let period = 'Неизвестный период';
      if (headers.length >= 4) {
        const match = headers[3].match(/\(за\s+(.*?)\)/);
        if (match) {
          period = match[1].trim();
        }
      }

      // Теперь парсим данные начиная со второй строки
      const dataLines = lines.slice(1).join('\n');
      const readableStream = Readable.from(dataLines);

      const results: any[] = [];
      readableStream
        .pipe(
          csv({
            headers: [
              'subject',
              'pointFpsr',
              'indicatorName',
              'indicatorValue',
            ],
          }),
        )
        .on('data', (data: CsvRow) => {
          // Пропускаем строки с английскими заголовками или пустые
          if (data.subject === 'Subject' || !data.subject) {
            return;
          }

          results.push({
            subject: data.subject?.trim(),
            pointFpsr: data.pointFpsr?.trim(),
            indicatorName: data.indicatorName?.trim(),
            indicatorValue: data.indicatorValue?.trim(),
            period: period, // Добавляем извлечённый период
          });
        })
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }
}
