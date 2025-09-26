import { Module } from '@nestjs/common';
import { FastServiceService } from './fast-service.service';
import { FastServiceController } from './fast-service.controller';
import { TelegramBotModule } from 'src/telegram-bot/telegram-bot.module';

@Module({
  imports: [TelegramBotModule],
  controllers: [FastServiceController],
  providers: [FastServiceService],
})
export class FastServiceModule {}
