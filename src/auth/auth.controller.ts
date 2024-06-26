import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetTokenBasedOnRefreshTokenDTO, LoginDTO } from './dtos';
import { CreateUserDTO } from 'src/user/dtos';
import { AccessTokenGuard } from './guards';
import { LoggedInUser } from 'src/config/decorators/loggedin-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  @Inject(AuthService) private readonly authService: AuthService;

  @Post('login')
  loginUser(@Body() dto: LoginDTO) {
    return this.authService.loginUser(dto);
  }

  @Post('signup')
  signupUser(@Body() dto: CreateUserDTO) {
    return this.authService.signupUser(dto);
  }

  @Post('refresh-token')
  @UseGuards(AccessTokenGuard)
  getTokenBasedOnRefreshToken(
    @LoggedInUser() user: User,
    @Body() dto: GetTokenBasedOnRefreshTokenDTO,
  ) {
    return this.authService.getTokenBasedOnRefreshToken(user, dto);
  }
}
