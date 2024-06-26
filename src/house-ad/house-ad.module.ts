import { Module } from '@nestjs/common';
import { HouseAdService } from './house-ad.service';
import { HouseAdController } from './house-ad.controller';

@Module({
  providers: [HouseAdService],
  controllers: [HouseAdController]
})
export class HouseAdModule {}
