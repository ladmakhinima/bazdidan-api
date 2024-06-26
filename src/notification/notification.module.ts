import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [NotificationGateway],
  imports: [AuthModule],
})
export class NotificationModule {}
