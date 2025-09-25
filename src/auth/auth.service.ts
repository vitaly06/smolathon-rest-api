import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signIn(login: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      throw new NotFoundException('Такой пользователь не найден');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new NotFoundException('Неверный пароль');
    }

    return user;
  }
}
