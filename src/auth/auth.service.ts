import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDTO } from './dtos';
import { CreateUserDTO } from 'src/user/dtos';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  @Inject(PrismaService) private readonly prisma: PrismaService;
  @Inject(UserService) private readonly userService: UserService;
  @Inject(JwtService) private readonly jwtService: JwtService;

  async loginUser(dto: LoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (!user) {
      throw new NotFoundException(
        'کاربری با این شماره تماس و گذرواژه یافت نشد',
      );
    }
    const hasCorrectPassword = await bcrypt.compare(
      dto.password,
      user.password,
    );
    if (!hasCorrectPassword) {
      throw new NotFoundException(
        'کاربری با این شماره تماس و گذرواژه یافت نشد',
      );
    }
    // generate token
    const token = this.jwtService.sign({ id: user.id, role: user.role });

    return { token };
  }

  async signupUser(dto: CreateUserDTO) {
    const user = await this.userService.createUser(dto);
    // generate token
  }

  getTokenBasedOnRefreshToken() {}
}
