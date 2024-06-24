import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { EstateAgencyModule } from './estate-agency/estate-agency.module';

@Module({
  imports: [ConfigModule, EstateAgencyModule],
})
export class AppModule {}
