import { ApiProperty } from '@nestjs/swagger';

export class DeleteVacancyResponseDto {
  @ApiProperty({ example: 'Вакансия успешно удалена' })
  message: string;
}
