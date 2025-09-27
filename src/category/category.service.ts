import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryResponseDto } from './dto/create-category-response.dto';
import { DeleteCategoryResponseDto } from './dto/delete-category-response.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(name: string): Promise<CreateCategoryResponseDto> {
    const checkCategory = await this.prisma.category.findUnique({
      where: { name },
    });

    if (checkCategory) {
      throw new BadRequestException('Данная категория уже существует');
    }

    const category = await this.prisma.category.create({
      data: { name },
    });

    return {
      message: 'Категория успешно создана',
      data: {
        id: category.id,
        name: category.name,
      },
    };
  }

  async delete(id: number): Promise<DeleteCategoryResponseDto> {
    const checkCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!checkCategory) {
      throw new NotFoundException('Данная категория не найдена');
    }

    // Проверяем, есть ли документы в этой категории
    const documentsInCategory = await this.prisma.document.findFirst({
      where: { categoryId: id },
    });

    if (documentsInCategory) {
      throw new BadRequestException(
        'Невозможно удалить категорию, так как в ней есть документы',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Категория успешно удалена' };
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    });

    return categories;
  }
}
