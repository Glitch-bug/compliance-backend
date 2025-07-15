import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,  {
  logger: ['log', 'debug', 'error', 'warn', 'verbose'],
});

  app.enableCors({
    origin: true, // Allow all origins for simplicity, tighten in production
    credentials: true,
  });
  //red
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
