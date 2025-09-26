import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramBotService implements OnApplicationBootstrap {
  private bot: Telegraf | null = null;
  private isReady = false;
  private pendingMessages: Array<{
    jobData: any;
    resolve: (value: boolean) => void;
    reject: (reason?: any) => void;
  }> = [];

  async onApplicationBootstrap() {
    await this.initializeBot();
  }

  private async initializeBot() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn('Telegram credentials not set, using stub mode');
      return;
    }

    try {
      console.log('Initializing Telegram bot...');
      this.bot = new Telegraf(token);

      // Проверяем соединение с Telegram API
      await this.bot.telegram.getMe();

      // Запускаем бота без блокировки
      this.bot
        .launch()
        .then(() => {
          console.log('✅ Telegram bot started successfully');
          this.isReady = true;

          // Обрабатываем ожидающие сообщения
          this.processPendingMessages();
        })
        .catch((error) => {
          console.error('❌ Telegram bot failed to start:', error);
          // Отклоняем все ожидающие сообщения
          this.rejectPendingMessages(error);
        });
    } catch (error) {
      console.error('Telegram bot initialization error:', error);
    }
  }

  private processPendingMessages() {
    this.pendingMessages.forEach(({ jobData, resolve }) => {
      this.sendMessageInternal(jobData).then(resolve);
    });
    this.pendingMessages = [];
  }

  private rejectPendingMessages(error: any) {
    this.pendingMessages.forEach(({ reject }) => {
      reject(error);
    });
    this.pendingMessages = [];
  }

  async sendJobResponseNotification(jobData: {
    fullName: string;
    phoneNumber: string;
    email: string;
    id?: number;
  }): Promise<boolean> {
    // Если бот еще не готов, добавляем сообщение в очередь
    if (!this.isReady || !this.bot) {
      console.log('⏳ Telegram bot not ready, queuing message...');

      return new Promise((resolve, reject) => {
        this.pendingMessages.push({ jobData, resolve, reject });

        // Устанавливаем таймаут для очереди (30 секунд)
        setTimeout(() => {
          if (!this.isReady) {
            console.log('📨 Telegram bot timeout, logging instead:', jobData);
            resolve(true); // Все равно считаем успешным, но логируем
          }
        }, 30000);
      });
    }

    return this.sendMessageInternal(jobData);
  }

  private async sendMessageInternal(jobData: {
    fullName: string;
    phoneNumber: string;
    email: string;
    id?: number;
  }): Promise<boolean> {
    try {
      const message = `
🎯 *Новая заявка на вакансию*

📝 *ID:* ${jobData.id || 'Новый'}
👤 *ФИО:* ${jobData.fullName}
📞 *Телефон:* ${jobData.phoneNumber}
📧 *Email:* ${jobData.email}
⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
      `;

      await this.bot!.telegram.sendMessage(
        process.env.TELEGRAM_CHAT_ID!,
        message,
        {
          parse_mode: 'Markdown',
        },
      );

      console.log('✅ Notification sent to Telegram');
      return true;
    } catch (error) {
      console.error('❌ Error sending to Telegram:', error);
      // При ошибке отправки тоже логируем локально
      console.log('📨 Fallback logging:', jobData);
      return true; // Все равно возвращаем true, так как сообщение обработано
    }
  }

  async onModuleDestroy() {
    if (this.bot) {
      this.bot.stop();
    }
  }
}
