import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  NotFoundException,
  Delete,
  Patch,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsResponseDto } from './dto/news-response.dto';
import { CreateNewsResponseDto } from './dto/create-news-response.dto';
import { UpdateNewsResponseDto } from './dto/update-news-response.dto';
import { DeleteNewsResponseDto } from './dto/delete-news-response.dto';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Создание новости с изображением' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Данные для создания новости',
    type: CreateNewsDto,
    examples: {
      example1: {
        summary: 'Пример создания новости',
        value: {
          title: 'Новая дорога в Смоленске',
          body: 'В Смоленске открывается новая автомобильная дорога...',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Новость успешно создана',
    type: CreateNewsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации данных',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Заголовок обязателен для заполнения',
          'Недопустимый формат изображения',
          'Размер изображения не должен превышать 5MB',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка сервера',
  })
  @UseInterceptors(FileInterceptor('image'))
  async createNews(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<CreateNewsResponseDto> {
    try {
      if (image) {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (!allowedMimeTypes.includes(image.mimetype)) {
          throw new BadRequestException(
            'Недопустимый формат изображения. Разрешены: JPEG, PNG, GIF, WebP',
          );
        }

        if (image.size > 5 * 1024 * 1024) {
          throw new BadRequestException(
            'Размер изображения не должен превышать 5MB',
          );
        }
      }

      let imageUrl: string | undefined;

      if (image) {
        imageUrl = image.filename;
      }

      const news = await this.newsService.createNews(createNewsDto, imageUrl);

      return {
        message: 'Новость успешно создана',
        data: news,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Ошибка при создании новости: ${error.message}`,
      );
    }
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Обновление новости' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID новости',
    example: 1,
  })
  @ApiBody({
    description: 'Данные для обновления новости',
    type: UpdateNewsDto,
    examples: {
      example1: {
        summary: 'Пример обновления новости',
        value: {
          title: 'Обновленный заголовок',
          body: 'Обновленный текст новости...',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Новость успешно обновлена',
    type: UpdateNewsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации данных',
  })
  @ApiNotFoundResponse({
    description: 'Новость не найдена',
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateNews(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<UpdateNewsResponseDto> {
    try {
      const existingNews = await this.newsService.getNewsById(id);
      if (!existingNews) {
        throw new NotFoundException('Новость не найдена');
      }

      if (image) {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (!allowedMimeTypes.includes(image.mimetype)) {
          throw new BadRequestException(
            'Недопустимый формат изображения. Разрешены: JPEG, PNG, GIF, WebP',
          );
        }

        if (image.size > 5 * 1024 * 1024) {
          throw new BadRequestException(
            'Размер изображения не должен превышать 5MB',
          );
        }
      }

      let imageUrl: string | undefined;

      if (image) {
        imageUrl = image.filename;
      }

      const updatedNews = await this.newsService.updateNews(
        id,
        updateNewsDto,
        imageUrl,
      );

      return {
        message: 'Новость успешно обновлена',
        data: updatedNews,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Ошибка при обновлении новости: ${error.message}`,
      );
    }
  }

  @Get('find-all')
  @ApiOperation({ summary: 'Получение всех новостей' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список новостей',
    type: [NewsResponseDto],
  })
  @ApiInternalServerErrorResponse({
    description: 'Внутренняя ошибка сервера',
  })
  async findAll(): Promise<NewsResponseDto[]> {
    return await this.newsService.getAllNews();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение новости по ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID новости',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Данные новости',
    type: NewsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверный ID новости',
  })
  @ApiNotFoundResponse({
    description: 'Новость не найдена',
  })
  async getNewsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<NewsResponseDto> {
    const news = await this.newsService.getNewsById(id);
    if (!news) {
      throw new NotFoundException('Новость не найдена');
    }

    return news;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление новости' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID новости',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Новость успешно удалена',
    type: DeleteNewsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверный ID новости',
  })
  @ApiNotFoundResponse({
    description: 'Новость не найдена',
  })
  async deleteNews(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteNewsResponseDto> {
    const existingNews = await this.newsService.getNewsById(id);
    if (!existingNews) {
      throw new NotFoundException('Новость не найдена');
    }

    await this.newsService.deleteNews(id);

    return {
      message: 'Новость успешно удалена',
    };
  }
}
