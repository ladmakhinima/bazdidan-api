import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { EstateAgencyModule } from './estate-agency/estate-agency.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule, EstateAgencyModule, UserModule],
})
export class AppModule {}
