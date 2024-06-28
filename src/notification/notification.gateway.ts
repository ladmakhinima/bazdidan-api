import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Chat } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { JWT_KEY } from 'src/constants/env.constant';

@WebSocketGateway()
@Injectable()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  private clients: Map<number, Socket> = new Map();

  @Inject(JwtService) private readonly jwtService: JwtService;
  @Inject(ConfigService) private readonly configService: ConfigService;
  @Inject(PrismaService) private readonly prismaService: PrismaService;
  @WebSocketServer() ws: Socket;

  afterInit(server: Server) {
    console.log('Gateway initialized');
  }

  async handleDisconnect(client: Socket) {
    if (client?.data?.user?.id) {
      this.clients.delete(client?.data?.user?.id);
      await this.prismaService.user.update({
        where: { id: client?.data?.user?.id },
        data: { isOnline: false },
      });
    }

    console.log('Client Disconnected');
  }

  async handleConnection(client: Socket, payload: any) {
    const token = client.handshake.auth.token;

    if (!token) {
      client.disconnect();
      return;
    }

    const decodedToken = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(JWT_KEY),
    });

    if (!decodedToken?.id) {
      client.disconnect();
      return;
    }

    client.data.user = decodedToken;

    this.clients.set(decodedToken.id, client);

    await this.prismaService.user.update({
      where: { id: decodedToken.id },
      data: { isOnline: true },
    });

    console.log('Client Connected');
  }

  @OnEvent('SEND_MESSAGE_TO_CONSULTANT_FOR_REQUEST')
  sendMessageToConsultantForRequest(data) {
    // !TODO: send message with client map to only send message to one user
    this.ws.emit('client_request_consultant_receive_ad', data);
  }

  @OnEvent('SEND_MESSAGE_TO_CONSULTANT_FOR_REQUEST')
  sendMessageToEstateAgencyForRequest(data) {
    this.ws.emit('client_request_estate_agency_receive_ad', data);
  }

  @OnEvent('CHAT.NEW_MESSAGE')
  sendNewMessageNotifyToUser(data: Chat) {
    this.ws.emit('new_message_create', data);
  }

  @OnEvent('CHAT.DELETE_MESSAGE')
  sendDeletedMessageNotifyToUser(data: Chat) {
    this.ws.emit('delete_message', data);
  }

  @SubscribeMessage('chat_user_typing')
  sendTypingNotifyToChatReceiver(data: any) {
    this.ws.emit('user_typing', data);
  }

  @SubscribeMessage('user_online')
  sendOnlineNotifyToChatReceiver(data: any) {
    this.ws.emit('user_online', data);
  }

  @SubscribeMessage('user_offline')
  sendOfflineNotifyToChatReceiver(data: any) {
    this.ws.emit('user_offline', data);
  }
}
