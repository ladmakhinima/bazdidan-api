import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateClientRequestDTO } from './dtos';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ClientRequestService {
  @Inject(PrismaService) private readonly prisma: PrismaService;
  @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2;

  async createRequest(
    user: User,
    dto: CreateClientRequestDTO,
    page: number,
    limit: number,
  ) {
    const condition: { [key: string]: any } = { ...dto };
    if (dto.options) condition.options = { contains: dto.options };

    const houseAds = await this.prisma.houseAd.findMany({
      where: condition,
      include: { consultant: true, estateAgency: true },
      orderBy: { createdAt: 'desc' },
      skip: limit * page,
      take: limit,
    });

    const houseAdsCount = await this.prisma.houseAd.count({
      where: condition,
    });

    for (const houseAd of houseAds) {
      await this.prisma.clientRequest.create({
        data: {
          estateAgencyId: houseAd.estateAgencyId,
          clientId: user.id,
          consultantId: houseAd.consultantId,
          houseAdId: houseAd.id,
          options: dto.options,
        },
      });

      //   send notification through websocket to consultant
      this.eventEmitter.emit(
        'NOTIFICATION.SEND_MESSAGE_TO_CONSULTANT_FOR_REQUEST',
        {
          houseAd,
        },
      );
      //   send notification through websocket to estateAgency
      this.eventEmitter.emit(
        'NOTIFICATION.SEND_MESSAGE_TO_CONSULTANT_FOR_REQUEST',
        {
          houseAd,
        },
      );
    }

    return {
      content: houseAds,
      count: houseAdsCount,
      currentPage: page,
      totalPage: Math.ceil(houseAdsCount / limit),
    };
  }

  async getClientRequestsList(
    page: number,
    limit: number,
    mode: string,
    user: User,
    estateAgencyId?: number,
  ) {
    if (!['client', 'consultant', 'estate-agency'].includes(mode)) {
      throw new BadRequestException('نقش یا مدل مورد نظر شما اشتباه میباشد');
    }

    const conditon: { [key: string]: number } = {};
    switch (mode) {
      case 'client':
        conditon.clientId = user.id;
        break;
      case 'consultantId':
        conditon.estateAgencyId = user.id;
        break;
      case 'estate-agency': {
        const estateAgency = await this.prisma.estateAgency.findUnique({
          where: { id: +estateAgencyId },
        });
        if (!estateAgency) {
          throw new NotFoundException('آژانس ملکی یافت نشد');
        }
        conditon.estateAgencyId = estateAgency.id;
        break;
      }
    }

    const clientRequestsCount = await this.prisma.clientRequest.count({
      where: conditon,
    });

    const clientRequests = await this.prisma.clientRequest.findMany({
      where: conditon,
      take: limit,
      skip: limit * page,
      include: {
        client: true,
        consultant: true,
        estateAgency: true,
        houseAd: true,
      },
    });

    return {
      content: clientRequests,
      count: clientRequestsCount,
      currentPage: page,
      totalPage: Math.ceil(clientRequestsCount / limit),
    };
  }

  async getClientRequestById(id: number) {
    const clientRequest = await this.prisma.clientRequest.findUnique({
      where: { id },
      include: {
        client: true,
        consultant: true,
        estateAgency: true,
        houseAd: true,
      },
    });

    if (!clientRequest) {
      throw new NotFoundException('درخواست جستجو یافت نشد');
    }

    return clientRequest;
  }
}
