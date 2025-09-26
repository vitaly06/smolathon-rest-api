import { ApiProperty } from '@nestjs/swagger';

export class CreateVacancyResponseDto {
  @ApiProperty({ example: 'Вакансия успешно создана' })
  message: string;
}
