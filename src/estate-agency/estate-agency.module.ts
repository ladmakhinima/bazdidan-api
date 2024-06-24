import { Module } from '@nestjs/common';
import { EstateAgencyService } from './estate-agency.service';
import { EstateAgencyController } from './estate-agency.controller';

@Module({
  providers: [EstateAgencyService],
  controllers: [EstateAgencyController],
})
export class EstateAgencyModule {}
