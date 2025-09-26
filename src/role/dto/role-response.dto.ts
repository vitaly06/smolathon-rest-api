import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор роли',
  })
  id: number;

  @ApiProperty({
    example: 'admin',
    description: 'Название роли',
  })
  name: string;
}
