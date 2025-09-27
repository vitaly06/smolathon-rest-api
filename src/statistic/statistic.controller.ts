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
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiPayloadTooLargeResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import type { Express } from 'express';
import { Readable } from 'stream';
import csv from 'csv-parser';
import { StatisticService } from './statistic.service';
import { UploadCsvResponseDto } from './dto/upload-csv-response.dto';
import { SmolenskDataResponseDto } from './dto/smolensk-data-response.dto';
import { PeriodsResponseDto } from './dto/periods-response.dto';
import { UploadCsvDto } from './dto/upload-csv.dto';

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
    type: UploadCsvDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Данные успешно загружены и обработаны',
    type: UploadCsvResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации файла или обработки данных',
    schema: {
      example: {
        statusCode: 400,
        message: 'Файл должен иметь расширение .csv',
        error: 'Bad Request',
      },
    },
  })
  @ApiPayloadTooLargeResponse({
    description: 'Файл слишком большой',
    schema: {
      example: {
        statusCode: 413,
        message: 'File too large',
        error: 'Payload Too Large',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка сервера',
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
  ): Promise<UploadCsvResponseDto> {
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
          data: [],
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Ошибка обработки CSV файла: ${error.message}`,
      );
    }
  }

  @Get('smolensk')
  @ApiOperation({
    summary: 'Получение всех данных по Смоленской области',
    description: 'Возвращает все статистические данные по Смоленской области',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Успешное получение данных',
    type: SmolenskDataResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Данные по Смоленской области не найдены',
  })
  async getSmolenskData(): Promise<SmolenskDataResponseDto> {
    return this.statisticsService.getAllSmolenskData();
  }

  @Get('periods')
  @ApiOperation({
    summary: 'Получение списка доступных периодов',
    description:
      'Возвращает уникальные периоды из базы данных для выбора в интерфейсе',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Успешное получение периодов',
    type: PeriodsResponseDto,
  })
  async getPeriods(): Promise<PeriodsResponseDto> {
    const periods = await this.statisticsService.getUniquePeriods();
    return { periods };
  }

  private parseCsvFile(buffer: Buffer): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const csvString = buffer.toString('utf-8');
      const lines = csvString.split(/\r?\n/);
      if (lines.length === 0) {
        return reject(new Error('Пустой файл'));
      }

      // Первая строка - заголовки
      const firstLine = lines[0].trim();
      const headers = firstLine
        .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        .map((h) => h.replace(/"/g, '').trim());

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
            period: period,
          });
        })
        .on('end', () => resolve(results))
        .on('error', reject);
    });
  }
}
