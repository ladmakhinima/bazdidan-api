import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
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
import { JWT_KEY } from 'src/constants/env.constant';

@WebSocketGateway()
@Injectable()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2;
  @Inject(JwtService) private readonly jwtService: JwtService;
  @Inject(ConfigService) private readonly configService: ConfigService;
  @WebSocketServer() ws: Socket;

  afterInit(server: Server) {
    console.log('Gateway initialized');
  }

  async handleDisconnect(client: Socket) {
    if (client?.data?.user?.id) {
      this.eventEmitter.emit('USER.CHANGE_STATUS', {
        isOnline: false,
        id: client?.data?.user?.id,
      });
    }
    client.broadcast.emit('NOTIFICATION.USER_DISCONNECT');

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

    this.eventEmitter.emit('USER.CHANGE_STATUS', {
      isOnline: true,
      id: decodedToken?.id,
    });

    client.broadcast.emit('NOTIFICATION.USER_CONNECT');

    console.log('Client Connected');
  }

  @OnEvent('NOTIFICATION.SEND_MESSAGE_TO_CONSULTANT_FOR_REQUEST')
  sendMessageToConsultantForRequest(data) {
    // !TODO: send message with client map to only send message to one user
    this.ws.emit('NOTIFICATION.CLIENT_REQUEST_CONSULTANT_RECEIVE_AD', data);
  }

  @OnEvent('NOTIFICATION.SEND_MESSAGE_TO_CONSULTANT_FOR_REQUEST')
  sendMessageToEstateAgencyForRequest(data) {
    this.ws.emit('NOTIFICATION.CLIENT_REQUEST_ESTATE_AGENCY_RECEIVE_AD', data);
  }

  @OnEvent('NOTIFICATION.CHAT_NEW_MESSAGE')
  sendNewMessageNotifyToUser(data: Chat) {
    this.ws.emit('NOTIFICATION.CHAT_NEW_MESSAGE', data);
  }

  @OnEvent('NOTIFICATION.CHAT_DELETE_MESSAGE')
  sendDeletedMessageNotifyToUser(data: Chat) {
    this.ws.emit('NOTIFICATION.CHAT_DELETE_MESSAGE', data);
  }

  @OnEvent('NOTIFICATION.CHAT_SEEN_MESSAGE')
  sendSeenMessageNotifyToUser(data: Chat) {
    this.ws.emit('NOTIFICATION.CHAT_SEEN_MESSAGE', data);
  }

  @SubscribeMessage('NOTIFICATION.CHAT_USER_TYPING')
  sendTypingNotifyToChatReceiver(data: any) {
    this.ws.emit('NOTIFICATION.CHAT_USER_TYPING', data);
  }
}
