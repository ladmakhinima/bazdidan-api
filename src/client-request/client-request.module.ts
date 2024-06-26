import { Module } from '@nestjs/common';
import { ClientRequestService } from './client-request.service';
import { ClientRequestController } from './client-request.controller';

@Module({
  providers: [ClientRequestService],
  controllers: [ClientRequestController]
})
export class ClientRequestModule {}
