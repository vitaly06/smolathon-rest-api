import { Module } from '@nestjs/common';
import { StatisticModule } from './statistic/statistic.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { PhotoModule } from './photo/photo.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [StatisticModule, PrismaModule, AuthModule, NewsModule, PhotoModule, AdminModule],
})
export class AppModule {}
