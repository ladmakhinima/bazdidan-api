import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PORT } from './constants/env.constant';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

const configApp = (app: INestApplication) => {
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory(errors) {
        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'خطای اعتبارسنجی',
          errors: errors.map((error) => ({
            property: error.property,
            messages: Object.values(error.constraints)[0],
          })),
        });
      },
    }),
  );
};

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  const configService = app.get(ConfigService);
  const port = configService.get(PORT);

  configApp(app);

  app.listen(+port, () => {
    console.log(`The server run at ${new Date()} on port ${port}`);
  });
};

bootstrap();
