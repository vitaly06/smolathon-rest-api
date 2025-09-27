import { ApiProperty } from '@nestjs/swagger';
import { CategoryResponseDto } from './category-response.dto';

export class CreateCategoryResponseDto {
  @ApiProperty({
    example: 'Категория успешно создана',
    description: 'Сообщение об успешном создании категории',
  })
  message: string;

  @ApiProperty({ type: CategoryResponseDto })
  data: CategoryResponseDto;
}
