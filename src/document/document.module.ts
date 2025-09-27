import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10, // 10 mb
        files: 1024 * 1024 * 10,
        fieldSize: 1024 * 1024 * 10,
      },
    }),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
