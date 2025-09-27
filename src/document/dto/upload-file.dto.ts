import { Type } from 'class-transformer';

export class UploadFileDto {
  title: string;
  description: string;
  @Type(() => Number)
  categoryId: number;
}
