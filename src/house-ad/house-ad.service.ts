import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateHouseAdDTO, UpdateHouseAdDTO } from './dtos';
import { User } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

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

  async updateHouseAdById(id: number, dto: UpdateHouseAdDTO, user: User) {
    const houseAd = await this.prismaService.houseAd.findFirst({
      where: { id },
    });
    if (!houseAd) {
      throw new NotFoundException('آگهی ملک یافت نشد');
    }
    if (houseAd.consultantId !== user.id) {
      throw new BadRequestException(
        'تنها خود سازنده این آگهی قادر به ویرایش میباشد',
      );
    }
    const duplicatedByTitle = await this.prismaService.houseAd.findUnique({
      where: {
        title: dto.title,
        NOT: { id },
      },
    });
    if (duplicatedByTitle) {
      throw new ConflictException('موضوع آگهی وارد شده تکراری میباشد');
    }
    return this.prismaService.houseAd.update({
      where: { id },
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
        type: dto.type,
        options: dto.options,
      },
    });
  }

  async getListsOfHouseAd(page: number, limit: number) {
    const houseAds = await this.prismaService.houseAd.findMany({
      orderBy: { createdAt: 'desc' },
      skip: limit * page,
      take: limit,
    });
    const houseAdsCount = await this.prismaService.houseAd.count();
    return {
      content: houseAds,
      count: houseAdsCount,
      currentPage: page,
      totalPage: Math.ceil(houseAdsCount / limit),
    };
  }

  async getHouseAdById(id: number) {
    const houseAd = await this.prismaService.houseAd.findFirst({
      where: { id },
      include: {
        consultant: true,
        estateAgency: true,
      },
    });
    if (!houseAd) {
      throw new NotFoundException('آگهی ملک یافت نشد');
    }
    return houseAd;
  }

  async deleteHouseAdById(id: number, user: User) {
    const houseAd = await this.prismaService.houseAd.findFirst({
      where: { id },
    });
    if (!houseAd) {
      throw new NotFoundException('آگهی ملک یافت نشد');
    }
    if (houseAd.consultantId !== user.id) {
      throw new BadRequestException(
        'تنها خود سازنده این آگهی قادر به ویرایش میباشد',
      );
    }
    return this.prismaService.houseAd.delete({ where: { id } });
  }

  async uploadAttchments(files: Express.Multer.File[]) {
    const uploadedFiles: string[] = [];
    const filePath = path.join(__dirname, '..', '..', 'public', 'house-ads');
    for (let file of files) {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${new Date().getTime()}-${Math.random() * 100000000}${fileExtension}`;
      fs.createWriteStream(filePath + '/' + fileName).write(file.buffer);
      uploadedFiles.push(fileName);
    }
    return uploadedFiles;
  }
}
