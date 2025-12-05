import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() { 
  dotenv.config();

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.enableCors({
  origin: [
      'http://localhost:3000',
      'http://192.168.1.5:3000',
      'https://your-frontend-domain.com',
      'https://backend-tk76..onrender.com'
  ],

  methods: "GET,POST,PUT,PATCH,DELETE",
  credentials: true,
});

  const port = process.env.PORT || 3000;
  await app.listen(process.env.PORT || 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);

}

bootstrap();
