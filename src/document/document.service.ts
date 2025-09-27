import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async uploadDocument(dto: UploadFileDto, fileUrl: string) {
    const checkCategory = await this.prisma.category.findUnique({
      where: { id: +dto.categoryId },
    });
    if (!checkCategory) {
      throw new BadRequestException('Такой категории не существует');
    }
    return await this.prisma.document.create({
      data: {
        title: dto.title,
        description: dto.description,
        categoryId: +dto.categoryId,
        fileUrl,
      },
    });
  }

  async findAll() {
    const data = await this.prisma.category.findMany({
      include: { Document: true },
    });

    return data;
  }

  async delete(id: number) {
    const checkDocument = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!checkDocument) {
      throw new BadRequestException('Данный документ не найден');
    }

    return await this.prisma.document.delete({
      where: { id },
    });
  }
}
