import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateHouseAdDTO } from './dtos';

@Injectable()
export class HouseAdService {
  @Inject(PrismaService) private readonly prismaService: PrismaService;

  createHouseAd(dto: CreateHouseAdDTO) {}

  getListsOfHouseAd() {}

  getHouseAdById() {}

  deleteHouseAdById() {}

  updateHouseAdById() {}
}
