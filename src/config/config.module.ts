import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [NestConfigModule.forRoot({ isGlobal: true }), PrismaModule],
})
export class ConfigModule {}
