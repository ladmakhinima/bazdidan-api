import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientRequestService } from './client-request.service';
import { AccessTokenGuard } from 'src/auth/guards';
import { LoggedInUser } from 'src/config/decorators';
import { User } from '@prisma/client';
import { CreateClientRequestDTO } from './dtos';

@Controller('client-request')
export class ClientRequestController {
  @Inject(ClientRequestService)
  private readonly clientRequestService: ClientRequestService;

  @Post()
  @UseGuards(AccessTokenGuard)
  createClientRequest(
    @LoggedInUser() user: User,
    @Body() dto: CreateClientRequestDTO,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.clientRequestService.createRequest(user, dto, +page, +limit);
  }

  @Get('collections/:mode')
  @UseGuards(AccessTokenGuard)
  getClientRequestsList(
    @Param('mode') mode: string,
    @Query('page') page: number = 0,
    @Query('limit') limit: number = 10,
    @LoggedInUser() user: User,
    @Query('estateAgencyId') estateAgencyId?: number,
  ) {
    return this.clientRequestService.getClientRequestsList(
      +page,
      +limit,
      mode,
      user,
      estateAgencyId,
    );
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  getClientRequestById(@Param('id', ParseIntPipe) id: number) {
    return this.clientRequestService.getClientRequestById(id);
  }
}
