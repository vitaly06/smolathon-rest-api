import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NewsService {
  private readonly baseUrl: string;
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:3000',
    );
  }

  async createNews(createNewsDto: CreateNewsDto, imageUrl?: string) {
    const news = await this.prisma.news.create({
      data: {
        title: createNewsDto.title,
        body: createNewsDto.body,
        imageUrl: `uploads/news/${imageUrl}`,
      },
    });

    news.imageUrl = `${this.baseUrl}/${news.imageUrl}`;

    return news;
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

    imageUrl = `uploads/news/${imageUrl}`;

    const news = await this.prisma.news.update({
      where: { id },
      data: {
        ...updateNewsDto,
        ...(imageUrl && { imageUrl }),
      },
    });

    news.imageUrl = `${this.baseUrl}/${news.imageUrl}`;

    return news;
  }

  async getAllNews() {
    const news = await this.prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return news.map((item) => ({
      ...item,
      createdAt: this.formatDate(item.createdAt),
      imageUrl: item.imageUrl ? `${this.baseUrl}/${item.imageUrl}` : null,
    }));
  }

  async getNewsById(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException('Данная новость не найдена');
    }

    return {
      ...news,
      createdAt: this.formatDate(news.createdAt),
      imageUrl: news.imageUrl ? `${this.baseUrl}/${news.imageUrl}` : null,
    };
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

  private formatDate(date: Date): string {
    const dateObj = new Date(date);

    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dateObj);
  }
}
