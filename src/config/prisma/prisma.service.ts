import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  onModuleDestroy() {
    this.$disconnect();
  }
  onModuleInit() {
    this.$connect();

    this.injectSoftDeleteExtension();
  }

  injectSoftDeleteExtension() {
    this.$use(async (params, next) => {
      if (params.action === 'delete') {
        params.action = 'update';
        params.args['data'] = { deletedAt: new Date() };
      } else if (params.action === 'deleteMany') {
        params.action = 'updateMany';
        params.args['data'] = { deletedAt: new Date() };
      } else if (params.action.startsWith('find')) {
        const condition = { ...(params.args['where'] || {}) };
        params.args['where'] = {
          ...condition,
          deletedAt: condition?.deletedAt || null,
        };
      }

      return next(params);
    });
  }
}
