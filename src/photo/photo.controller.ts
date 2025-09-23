import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { ApiOperation, ApiParam, ApiProduces } from '@nestjs/swagger';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { lookup } from 'mime-types';
import express from 'express';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @ApiOperation({
    summary: 'Получение фото',
  })
  @ApiParam({
    name: 'type',
    description: 'Тип файла',
    enum: ['news'],
  })
  @ApiParam({ name: 'filename', description: 'Имя файла', type: String })
  @ApiProduces('image/*')
  @Get('photo/:type/:filename')
  async getPhoto(
    @Param('type') type: string,
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: express.Response,
  ): Promise<StreamableFile> {
    if (!['news'].includes(type)) {
      throw new BadRequestException(
        'Недопустимый тип файла. Допустимые значения: news',
      );
    }

    const filePath = join(process.cwd(), 'uploads', `${type}`, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('Файл не найден');
    }

    // Используем импортированную функцию lookup
    const mimeType = lookup(filePath) || 'application/octet-stream';

    // Создаем поток для чтения файла
    const fileStream = createReadStream(filePath);

    // Устанавливаем заголовки ответа
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'public, max-age=31536000',
    });

    return new StreamableFile(fileStream);
  }
}
