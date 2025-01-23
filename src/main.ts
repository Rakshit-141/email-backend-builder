import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'; // ✅ Fix: Import Express

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Increase request body size limit to 50MB
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // ✅ Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  await app.listen(3001);
}

bootstrap();
