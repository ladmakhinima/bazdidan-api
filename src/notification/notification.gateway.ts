import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JWT_KEY } from 'src/constants/env.constant';

@WebSocketGateway()
@Injectable()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @Inject(JwtService) private readonly jwtService: JwtService;
  @Inject(ConfigService) private readonly configService: ConfigService;
  @WebSocketServer() ws: Socket;

  afterInit(server: Server) {
    console.log('Gateway initialized');
  }

  handleDisconnect(client: Socket) {
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

    client.data.user = decodedToken;

    console.log('Client Connected');
  }

  @OnEvent('SEND_MESSAGE_TO_CONSULTANT_FOR_REQUEST')
  sendMessageToConsultantForRequest(data) {
    this.ws.emit('client_request_consultant_receive_ad', data);
  }

  @OnEvent('SEND_MESSAGE_TO_CONSULTANT_FOR_REQUEST')
  sendMessageToEstateAgencyForRequest(data) {
    this.ws.emit('client_request_estate_agency_receive_ad', data);
  }
}
