import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramBotService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TelegramBotService.name);
  private bot: Telegraf | null = null;
  private isReady = false;
  private pendingMessages: Array<{
    message: string;
    resolve: (value: boolean) => void;
    reject: (reason?: any) => void;
  }> = [];

  async onApplicationBootstrap() {
    await this.initializeBot();
  }

  private async initializeBot() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    this.logger.log(`TELEGRAM_BOT_TOKEN: ${token ? 'Задан' : 'Отсутствует'}`);
    this.logger.log(`TELEGRAM_CHAT_ID: ${chatId ? 'Задан' : 'Отсутствует'}`);

    if (!token || !chatId) {
      this.logger.warn(
        'Telegram credentials not set, bot will not be initialized',
      );
      return;
    }

    try {
      this.logger.log('Инициализация Telegram бота...');
      this.bot = new Telegraf(token);

      // Проверка соединения с Telegram API (токен валиден)
      const botInfo = await this.bot.telegram.getMe();
      this.logger.log(`Информация о боте: ${JSON.stringify(botInfo)}`);

      // Поскольку бот только отправляет сообщения, polling не нужен — устанавливаем ready сразу
      this.isReady = true;
      this.logger.log(
        '✅ Telegram бот готов к отправке сообщений (без polling)',
      );

      // Обработка ожидающих сообщений
      this.processPendingMessages();
    } catch (error) {
      this.logger.error(`Ошибка инициализации Telegram бота: ${error.message}`);
      this.rejectPendingMessages(error);
    }
  }

  private processPendingMessages() {
    this.logger.log(
      `Обработка ${this.pendingMessages.length} сообщений в очереди...`,
    );
    this.pendingMessages.forEach(({ message, resolve, reject }, index) => {
      this.logger.log(`Обработка сообщения ${index + 1}: ${message}`);
      this.sendMessageInternal(message)
        .then(resolve)
        .catch((error) => {
          this.logger.error(
            `Ошибка обработки сообщения ${index + 1}: ${error.message}`,
          );
          reject(error);
        });
    });
    this.pendingMessages = [];
  }

  private rejectPendingMessages(error: any) {
    this.logger.error(
      `Отклонение ${this.pendingMessages.length} сообщений из-за ошибки: ${error.message}`,
    );
    this.pendingMessages.forEach(({ reject }) => reject(error));
    this.pendingMessages = [];
  }

  async sendJobResponseNotification(message: string): Promise<boolean> {
    // Если бот не готов, добавляем в очередь с таймаутом
    if (!this.isReady || !this.bot) {
      this.logger.warn('⏳ Telegram бот не готов, добавление в очередь...');
      return new Promise((resolve, reject) => {
        this.pendingMessages.push({ message, resolve, reject });
        setTimeout(() => {
          if (!this.isReady) {
            const timeoutError = new Error(
              'Telegram бот не инициализирован после таймаута',
            );
            this.logger.error(
              `Таймаут: ${timeoutError.message}, сообщение: ${message}`,
            );
            reject(timeoutError);
          }
        }, 30000); // 30 секунд таймаут
      });
    }

    // Если готов, отправляем сразу
    return this.sendMessageInternal(message);
  }

  private async sendMessageInternal(message: string): Promise<boolean> {
    try {
      await this.bot!.telegram.sendMessage(
        process.env.TELEGRAM_CHAT_ID!,
        message,
        { parse_mode: 'Markdown' },
      );

      this.logger.log('✅ Уведомление отправлено в Telegram');
      return true;
    } catch (error) {
      this.logger.error(`❌ Ошибка отправки в Telegram: ${error.message}`);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.bot) {
      this.logger.log('Telegram бот остановлен (без polling)');
    }
  }
}
