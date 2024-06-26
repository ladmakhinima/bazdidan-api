import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateHouseAdDTO, UpdateHouseAdDTO } from './dtos';
import { AccessTokenGuard } from 'src/auth/guards';
import { LoggedInUser } from 'src/config/decorators';
import { User } from '@prisma/client';
import { HouseAdService } from './house-ad.service';

@Controller('house-ad')
export class HouseAdController {
  @Inject(HouseAdService) private readonly houseAdService: HouseAdService;

  @Post()
  @UseGuards(AccessTokenGuard)
  createHouseAd(@Body() dto: CreateHouseAdDTO, @LoggedInUser() user: User) {
    return this.houseAdService.createHouseAd(user, dto);
  }

  @Get()
  getHouseAds(@Query('limit') limit: number, @Query('page') page: number) {
    return this.houseAdService.getListsOfHouseAd(page, limit);
  }

  @Get(':id')
  getHouseAdById(@Param('id', ParseIntPipe) id: number) {
    return this.houseAdService.getHouseAdById(id);
  }

  @Put(':id')
  @UseGuards(AccessTokenGuard)
  updateHouseAdById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHouseAdDTO,
    @LoggedInUser() user: User,
  ) {
    return this.houseAdService.updateHouseAdById(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteHouseAdById(
    @Param('id', ParseIntPipe) id: number,
    @LoggedInUser() user: User,
  ) {
    return this.houseAdService.deleteHouseAdById(id, user);
  }
}
