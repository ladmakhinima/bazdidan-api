import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InsertEstateAgencyDTO } from './dtos';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as jimp from 'jimp';
import * as path from 'path';

@Injectable()
export class EstateAgencyService {
  @Inject(PrismaService) private readonly prisma: PrismaService;

  async createEstateAgency(dto: InsertEstateAgencyDTO) {
    const duplicatedByTitle = await this.prisma.estateAgency.count({
      where: { name: dto.name },
    });
    if (duplicatedByTitle) {
      throw new ConflictException('نام آژانس تکراری میباشد');
    }
    return this.prisma.estateAgency.create({
      data: {
        address: dto.address,
        logo: dto.logo,
        managerName: dto.managerName,
        name: dto.name,
        phone: dto.phone,
        status: 'NOT_APPROVE',
      },
    });
  }

  async updateEstateAgencyById(id: number, dto: InsertEstateAgencyDTO) {
    const estateAgency = await this.prisma.estateAgency.findUnique({
      where: { id },
    });
    if (!estateAgency) {
      throw new NotFoundException('آژانس تبلیغاتی یافت نشد');
    }
    return this.prisma.estateAgency.update({ where: { id }, data: dto });
  }

  async deleteEstateAgencyById(id: number) {
    const estateAgency = await this.prisma.estateAgency.findUnique({
      where: { id },
    });
    if (!estateAgency) {
      throw new NotFoundException('آژانس تبلیغاتی یافت نشد');
    }
    const deletedAgency = await this.prisma.estateAgency.delete({
      where: { id },
    });
    if (!deletedAgency.id) {
      throw new BadRequestException('عملیات حذف آژانس با شکست مواجعه شد');
    }
    return deletedAgency;
  }

  async findEstateAgencyById(id: number) {
    const estateAgency = await this.prisma.estateAgency.findUnique({
      where: { id },
    });
    if (!estateAgency) {
      throw new NotFoundException('آژانس تبلیغاتی یافت نشد');
    }
    return estateAgency;
  }

  async findAllEstateAgencies(page: number = 0, limit: number = 10) {
    const count = await this.prisma.estateAgency.count();
    const content = await this.prisma.estateAgency.findMany({
      skip: page * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      count,
      content,
      currentPage: page,
      totalPage: Math.ceil(count / limit),
    };
  }

  async uploadEstateAgencyLogo(file: Express.Multer.File) {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${new Date().getTime()}-${Math.random() * 100000000}${fileExtension}`;
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'public',
      'logos',
      fileName,
    );
    const localFile = await jimp.read(file.buffer);
    await localFile.resize(80, 80).quality(80).circle().writeAsync(filePath);
    return { fileName };
  }
}
