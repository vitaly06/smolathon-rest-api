import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    app.enableCors({
      origin: true,
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());

    const config = new DocumentBuilder()
      .setTitle('Smolathon Rest API')
      .setDescription('Rest API for Smolathon')
      .setVersion('1.0.0')
      .setContact(
        'Vitaly Sadikov',
        'https://github.com/vitaly06',
        'vitaly.sadikov1@yandex.ru',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        urls: [
          {
            url: '/docs-yaml',
            name: 'Download YAML',
          },
        ],
      },
    });

    await app.listen(3000);
  } catch (error) {
    process.exit(1);
  }
}

bootstrap();
