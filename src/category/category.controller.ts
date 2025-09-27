import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryResponseDto } from './dto/create-category-response.dto';
import { DeleteCategoryResponseDto } from './dto/delete-category-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создание новой категории',
    description:
      'Создание категории для документов. Доступно только авторизованным пользователям.',
  })
  @ApiBody({
    type: CreateCategoryDto,
    examples: {
      example1: {
        summary: 'Пример создания категории',
        value: {
          name: 'Техническая документация',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Категория успешно создана',
    type: CreateCategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверные данные запроса',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Название категории обязательно для заполнения',
          'Название категории должно содержать минимум 2 символа',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Категория с таким названием уже существует',
    schema: {
      example: {
        statusCode: 400,
        message: 'Данная категория уже существует',
        error: 'Bad Request',
      },
    },
  })
  async createCategory(
    @Body() dto: CreateCategoryDto,
  ): Promise<CreateCategoryResponseDto> {
    return await this.categoryService.createCategory(dto.name);
  }

  @Get('find-all')
  @ApiOperation({
    summary: 'Получение всех категорий',
    description: 'Возвращает список всех категорий документов',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Список категорий успешно получен',
    type: [CategoryResponseDto],
    examples: {
      example1: {
        summary: 'Пример списка категорий',
        value: [
          { id: 1, name: 'Техническая документация' },
          { id: 2, name: 'Юридические документы' },
          { id: 3, name: 'Финансовые отчеты' },
        ],
      },
    },
  })
  async findAll(): Promise<CategoryResponseDto[]> {
    return await this.categoryService.findAll();
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Удаление категории',
    description:
      'Удаление категории по ID. Доступно только авторизованным пользователям.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID категории',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Категория успешно удалена',
    type: DeleteCategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Неверный ID категории',
    schema: {
      example: {
        statusCode: 400,
        message: 'Неверный ID категории',
        error: 'Bad Request',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Категория не найдена',
    schema: {
      example: {
        statusCode: 404,
        message: 'Данная категория не найдена',
        error: 'Not Found',
      },
    },
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteCategoryResponseDto> {
    return await this.categoryService.delete(id);
  }
}
