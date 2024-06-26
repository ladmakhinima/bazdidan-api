import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { CreateHouseAdDTO } from './dtos';
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
}
