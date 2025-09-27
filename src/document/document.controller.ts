import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';
import { ConfigService } from '@nestjs/config';

@Controller('document')
export class DocumentController {
  private readonly baseUrl: string;
  constructor(
    private readonly documentService: DocumentService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:3000',
    );
  }

  @Post('upload')
  @ApiOperation({ summary: 'Загрузка документа' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Данные для загрузки документа',
    type: UploadFileDto,
    examples: {
      example1: {
        summary: 'Пример загрузки документа',
        value: {
          title: 'Устав учреждения',
          description: 'Какие цели выполняем и как работаем',
          categoryId: 1,
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocument(
    @Body() uploadFileDto: UploadFileDto,
    @UploadedFile() document?: Express.Multer.File,
  ) {
    const fileUrl = `uploads/documents/${document?.filename}`;

    const createdDocument = await this.documentService.uploadDocument(
      uploadFileDto,
      fileUrl,
    );

    createdDocument.fileUrl = `${this.baseUrl}/${createdDocument.fileUrl}`;

    return {
      message: 'Документ успешно загружен',
      data: { createdDocument },
    };
  }

  @Get('find-all')
  async findAll() {
    return await this.documentService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.documentService.delete(+id);
  }
}
