import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessTokenGuard } from 'src/auth/guards';
import { CreateMessageDTO } from './dtos';
import { LoggedInUser } from 'src/config/decorators';
import { User } from '@prisma/client';

@Controller('chat')
export class ChatController {
  @Inject(ChatService) private readonly chatService: ChatService;

  @Post()
  @UseGuards(AccessTokenGuard)
  createMessage(@Body() dto: CreateMessageDTO) {
    return this.chatService.createMessage(dto);
  }

  @Get(':houseAdId/:firstSide/:secondSide')
  @UseGuards(AccessTokenGuard)
  getMessagesList(
    @Query('limit') limit: number = 10,
    @Query() page: number = 0,
    @Param('firstSide', ParseIntPipe) firstSide: number,
    @Param('secondSide', ParseIntPipe) secondSide: number,
    @Param('houseAdId', ParseIntPipe) houseAdId: number,
  ) {
    return this.chatService.getMessages(
      firstSide,
      secondSide,
      houseAdId,
      limit,
      page,
    );
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteMessageById(
    @Param('id', ParseIntPipe) id: number,
    @LoggedInUser() loggedInUser: User,
  ) {
    return this.chatService.deleteMessage(loggedInUser, id);
  }

  @Patch('seen/:id')
  @UseGuards(AccessTokenGuard)
  seenMessageByUser(
    @LoggedInUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.chatService.seenMessage(user, id);
  }
}
