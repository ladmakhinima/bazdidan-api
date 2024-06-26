import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateHouseAdDTO } from './dtos';
import { User } from '@prisma/client';

@Injectable()
export class HouseAdService {
  @Inject(PrismaService) private readonly prismaService: PrismaService;

  async createHouseAd(user: User, dto: CreateHouseAdDTO) {
    const duplicatedByTitle = await this.prismaService.houseAd.findFirst({
      where: { title: dto.title },
    });
    if (duplicatedByTitle) {
      throw new ConflictException('موضوع آگهی وارد شده تکراری میباشد');
    }
    dto.estateAgency = await this.prismaService.estateAgency.findFirst({
      where: { id: dto.estateAgency as number },
    });
    if (!dto.estateAgency) {
      throw new NotFoundException('آژانس تبلیغاتی یافت نشد');
    }
    return this.prismaService.houseAd.create({
      data: {
        title: dto.title,
        address: dto.address,
        description: dto.description,
        houseType: dto.houseType,
        meterage: dto.meterage,
        pricePerMeter: dto.pricePerMeter,
        roomNumber: dto.roomNumber,
        yearOfConstruction: dto.yearOfConstruction,
        attachments: dto.attachments,
        estateAgencyId: dto.estateAgency.id,
        type: dto.type,
        options: dto.options,
        consultantId: user.id,
      },
    });
  }

  getListsOfHouseAd() {}

  getHouseAdById() {}

  deleteHouseAdById() {}

  updateHouseAdById() {}
}
