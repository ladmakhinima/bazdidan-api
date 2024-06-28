import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class UserListener {
  @Inject(PrismaService) private readonly prisma: PrismaService;

  @OnEvent('USER.CHANGE_STATUS')
  async userChangeStatus(data: { id: number; isOnline: boolean }) {
    await this.prisma.user.update({
      where: { id: data.id },
      data: { isOnline: data.isOnline },
    });
  }
}
