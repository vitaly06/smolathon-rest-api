import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async createNews(createNewsDto: CreateNewsDto, imageUrl?: string) {
    return this.prisma.news.create({
      data: {
        title: createNewsDto.title,
        body: createNewsDto.body,
        imageUrl: imageUrl,
      },
    });
  }

  async updateNews(
    id: number,
    updateNewsDto: UpdateNewsDto,
    imageUrl?: string,
  ) {
    const existingNews = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      throw new NotFoundException('Новость не найдена');
    }

    return this.prisma.news.update({
      where: { id },
      data: {
        ...updateNewsDto,
        ...(imageUrl && { imageUrl }),
      },
    });
  }

  async getAllNews() {
    return this.prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getNewsById(id: number) {
    return this.prisma.news.findUnique({
      where: { id },
    });
  }

  async deleteNews(id: number) {
    const existingNews = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      throw new NotFoundException('Новость не найдена');
    }

    return await this.prisma.news.delete({
      where: { id },
    });
  }
}
