import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDTO } from './dtos';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { Chat, User } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatService {
  @Inject(PrismaService) private readonly prismaService: PrismaService;
  @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2;

  async createMessage(dto: CreateMessageDTO) {
    dto.receiver = await this.prismaService.user.findUnique({
      where: { id: dto.receiver as number },
    });

    if (!dto.receiver) {
      throw new NotFoundException('کاربر دریافت کننده دریافت نشد');
    }
    dto.sender = await this.prismaService.user.findUnique({
      where: { id: dto.sender as number },
    });
    if (!dto.sender) {
      throw new NotFoundException('کاربر ارسال کننده یافت نشد');
    }
    if (dto.parent) {
      dto.parent = await this.prismaService.chat.findUnique({
        where: { id: dto.parent as number },
      });

      if (!dto.parent) {
        throw new NotFoundException('پیام ریپلای شده یافت نشد');
      }
    }
    dto.houseAd = await this.prismaService.houseAd.findUnique({
      where: { id: dto.houseAd as number },
    });
    if (!dto.houseAd) {
      throw new NotFoundException('آگهی ملکی مربوط به این پیام یافت نشد');
    }

    const newMessage = await this.prismaService.chat.create({
      data: {
        content: dto.content,
        attachments: dto.attachments,
        parentId: (dto.parent as Chat)?.id,
        houseAdId: dto.houseAd.id,
        receiverId: dto.receiver.id,
        senderId: dto.sender.id,
      },
      include: { houseAd: true, parent: true, receiver: true, sender: true },
    });

    this.eventEmitter.emit('CHAT.NEW_MESSAGE', { newMessage });

    return newMessage;
  }

  async getMessages(
    firstSide: number,
    secondSide: number,
    houseAdId: number,
    limit: number,
    page: number,
  ) {
    const messagesContent = await this.prismaService.chat.findMany({
      where: {
        OR: [
          {
            houseAdId,
            senderId: firstSide,
            receiverId: secondSide,
          },
          {
            houseAdId,
            senderId: secondSide,
            receiverId: firstSide,
          },
        ],
      },
      include: {
        houseAd: true,
        parent: true,
        receiver: true,
        sender: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: limit * page,
    });

    const messagesCount = await this.prismaService.chat.count({
      where: {
        OR: [
          {
            houseAdId,
            senderId: firstSide,
            receiverId: secondSide,
          },
          {
            houseAdId,
            senderId: secondSide,
            receiverId: firstSide,
          },
        ],
      },
    });

    return {
      count: messagesCount,
      content: messagesContent,
      currentPage: page,
      totalPage: Math.ceil(messagesCount / limit),
    };
  }

  async deleteMessage(creator: User, id: number) {
    const message = await this.prismaService.chat.findFirst({
      where: {
        senderId: creator.id,
        id,
      },
    });

    if (!message) {
      throw new NotFoundException('پیامی یافت نشد');
    }

    const deletedMessage = await this.prismaService.chat.delete({
      where: { senderId: creator.id, id },
      include: { houseAd: true, parent: true, receiver: true, sender: true },
    });

    this.eventEmitter.emit('CHAT.DELETE_MESSAGE', { deletedMessage });

    return deletedMessage;
  }
}
