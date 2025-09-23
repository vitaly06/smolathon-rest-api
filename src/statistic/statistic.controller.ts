// controllers/statistic.controller.ts
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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
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
              period: { type: 'string', example: 'январь - март 2018 г.' },
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
      'Возвращает все сохраненные статистические данные по Смоленской области',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешное получение данных',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          subject: { type: 'string', example: 'Смоленская область' },
          pointFpsr: { type: 'string', example: '3_1' },
          indicatorName: {
            type: 'string',
            example: 'Количество ДТП с пострадавшими',
          },
          indicatorValue: { type: 'number', example: 167 },
          indicatorValueString: { type: 'string', example: '167' },
          period: { type: 'string', example: 'январь - март 2018 г.' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        },
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
  async getSmolenskData() {
    return this.statisticsService.getSmolenskData();
  }

  private parseCsvFile(buffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      const readableStream = Readable.from(buffer.toString());

      readableStream
        .pipe(
          csv({
            headers: [
              'subject',
              'pointFpsr',
              'indicatorName',
              'indicatorValue',
            ],
            mapHeaders: ({ header, index }) => {
              // Пропускаем заголовки
              if (
                index === 0 &&
                (header.includes('Субъект') || header.includes('Subject'))
              ) {
                return null;
              }
              return header;
            },
          }),
        )
        .on('data', (data: CsvRow) => {
          // Пропускаем строки с английскими заголовками
          if (data.subject === 'Subject' || !data.subject) {
            return;
          }

          results.push({
            subject: data.subject?.trim(),
            pointFpsr: data.pointFpsr?.trim(),
            indicatorName: data.indicatorName?.trim(),
            indicatorValue: data.indicatorValue?.trim(),
            period: 'январь - март 2018 г.',
          });
        })
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }
}
