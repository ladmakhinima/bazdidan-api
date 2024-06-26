import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { EstateAgencyModule } from './estate-agency/estate-agency.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HouseAdModule } from './house-ad/house-ad.module';

@Module({
  imports: [
    ConfigModule,
    EstateAgencyModule,
    UserModule,
    AuthModule,
    HouseAdModule,
  ],
})
export class AppModule {}
