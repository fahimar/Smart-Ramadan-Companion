import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe — rejects invalid DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true,        // auto-cast types (string → number etc.)
    }),
  );

  // Global exception filter — consistent error response format
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response wrapper — { success, data, timestamp }
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  app.enableCors();

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`🌙 Smart Ramadan Companion API running on port ${port}`);
}

bootstrap();
