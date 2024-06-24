import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos';
import { CreateUserDTO } from 'src/user/dtos';

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
}
