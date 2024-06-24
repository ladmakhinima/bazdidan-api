import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PORT } from './constants/env.constant';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  const configService = app.get(ConfigService);
  const port = configService.get(PORT);

  app.listen(+port, () => {
    console.log(`The server run at ${new Date()} on port ${port}`);
  });
};

bootstrap();
