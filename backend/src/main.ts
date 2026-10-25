import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/prisma-exception.filter';
import { parseAllowedOrigins } from './common/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.setGlobalPrefix('api');

  // En desarrollo se acepta cualquier origen; en producción solo ALLOWED_ORIGINS
  const isDev = process.env.NODE_ENV !== 'production';
  app.enableCors({
    origin: isDev ? true : parseAllowedOrigins(process.env.ALLOWED_ORIGINS),
  });

  app.useGlobalFilters(new PrismaExceptionFilter(app.getHttpAdapter()));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = parseInt(process.env.PORT ?? '4000', 10);
  await app.listen(port);
  Logger.log(`SW2 backend corriendo en http://localhost:${port}/api`, 'Bootstrap');
}

bootstrap();
