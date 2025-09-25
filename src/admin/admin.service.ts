import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async addEmployee(login: string, password: string, roleId: number) {
    const checkUser = await this.prisma.user.findUnique({
      where: { login },
    });

    if (checkUser) {
      throw new BadRequestException(
        'Пользователь с таким логином уже существует',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        roleId,
      },
    });
  }
}
