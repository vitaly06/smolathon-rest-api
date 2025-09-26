import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { NewsResponseDto } from './dto/news-response.dto';

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

  async createNews(
    createNewsDto: CreateNewsDto,
    imageUrl?: string,
  ): Promise<NewsResponseDto> {
    const news = await this.prisma.news.create({
      data: {
        title: createNewsDto.title,
        body: createNewsDto.body,
        imageUrl: imageUrl ? `uploads/news/${imageUrl}` : null,
      },
    });

    return this.transformNews(news);
  }

  async updateNews(
    id: number,
    updateNewsDto: UpdateNewsDto,
    imageUrl?: string,
  ): Promise<NewsResponseDto> {
    const existingNews = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      throw new NotFoundException('Новость не найдена');
    }

    const updateData: any = { ...updateNewsDto };

    if (imageUrl) {
      updateData.imageUrl = `uploads/news/${imageUrl}`;
    }

    const news = await this.prisma.news.update({
      where: { id },
      data: updateData,
    });

    return this.transformNews(news);
  }

  async getAllNews(): Promise<NewsResponseDto[]> {
    const news = await this.prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return news.map((item) => this.transformNews(item));
  }

  async getNewsById(id: number): Promise<NewsResponseDto> {
    const news = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      throw new NotFoundException('Данная новость не найдена');
    }

    return this.transformNews(news);
  }

  async deleteNews(id: number): Promise<void> {
    const existingNews = await this.prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      throw new NotFoundException('Новость не найдена');
    }

    await this.prisma.news.delete({
      where: { id },
    });
  }

  private transformNews(news: any): NewsResponseDto {
    return {
      id: news.id,
      title: news.title,
      body: news.body,
      imageUrl: news.imageUrl ? `${this.baseUrl}/${news.imageUrl}` : null,
      createdAt: news.createdAt.toISOString(),
      formattedDate: this.formatDate(news.createdAt),
      userId: news.userId,
    };
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
