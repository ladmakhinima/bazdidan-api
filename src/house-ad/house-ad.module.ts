import { Module } from '@nestjs/common';
import { HouseAdService } from './house-ad.service';

@Module({
  providers: [HouseAdService]
})
export class HouseAdModule {}
