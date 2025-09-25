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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Создание новости с изображением' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Данные для создания новости',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Заголовок новости',
        },
        body: {
          type: 'string',
          description: 'Текст новости',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Изображение новости',
        },
      },
      required: ['title', 'body'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Новость успешно создана',
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации данных',
  })
  @UseInterceptors(FileInterceptor('image'))
  async createNews(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
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
  @ApiBody({
    description: 'Данные для обновления новости (все поля необязательные)',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Заголовок новости',
        },
        body: {
          type: 'string',
          description: 'Текст новости',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Новое изображение новости',
        },
      },
      required: [],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Новость успешно обновлена',
  })
  @ApiResponse({
    status: 404,
    description: 'Новость не найдена',
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации данных',
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateNews(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    try {
      const newsId = parseInt(id);
      if (isNaN(newsId)) {
        throw new BadRequestException('Неверный ID новости');
      }

      const existingNews = await this.newsService.getNewsById(newsId);
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
        newsId,
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
    status: 200,
    description: 'Список новостей',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Заголовок новости' },
          body: { type: 'string', example: 'Текст новости' },
          imageUrl: {
            type: 'string',
            example: 'image.jpg',
            nullable: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00.000Z',
          },
          // user: {
          //   type: 'object',
          //   properties: {
          //     id: { type: 'number', example: 1 },
          //     login: { type: 'string', example: 'admin' },
          //     role: {
          //       type: 'object',
          //       properties: {
          //         id: { type: 'number', example: 1 },
          //         name: { type: 'string', example: 'ADMIN' },
          //       },
          //     },
          //   },
          //   nullable: true,
          // },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
      },
    },
  })
  async findAll() {
    const news = await this.newsService.getAllNews();
    return news;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение новости по ID' })
  @ApiResponse({
    status: 200,
    description: 'Данные новости',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        title: { type: 'string', example: 'Заголовок новости' },
        body: { type: 'string', example: 'Текст новости' },
        imageUrl: {
          type: 'string',
          example: 'image.jpg',
          nullable: true,
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-01T00:00:00.000Z',
        },
        // user: {
        //   type: 'object',
        //   properties: {
        //     id: { type: 'number', example: 1 },
        //     login: { type: 'string', example: 'admin' },
        //     role: {
        //       type: 'object',
        //       properties: {
        //         id: { type: 'number', example: 1 },
        //         name: { type: 'string', example: 'ADMIN' },
        //       },
        //     },
        //   },
        //   nullable: true,
        // },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Неверный ID новости',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Неверный ID новости' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Новость не найдена',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Новость не найдена' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async getNewsById(@Param('id') id: string) {
    const newsId = parseInt(id);
    if (isNaN(newsId)) {
      throw new BadRequestException('Неверный ID новости');
    }

    const news = await this.newsService.getNewsById(newsId);
    if (!news) {
      throw new NotFoundException('Новость не найдена');
    }

    return news;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление новости' })
  @ApiResponse({
    status: 200,
    description: 'Новость успешно удалена',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Новость успешно удалена',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Неверный ID новости',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Неверный ID новости' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Новость не найдена',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Новость не найдена' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  async deleteNews(@Param('id') id: string) {
    const newsId = parseInt(id);
    if (isNaN(newsId)) {
      throw new BadRequestException('Неверный ID новости');
    }

    const existingNews = await this.newsService.getNewsById(newsId);
    if (!existingNews) {
      throw new NotFoundException('Новость не найдена');
    }

    await this.newsService.deleteNews(newsId);

    return {
      message: 'Новость успешно удалена',
    };
  }
}
