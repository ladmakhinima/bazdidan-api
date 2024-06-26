import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateRefreshTokenDTO,
  GetTokenBasedOnRefreshTokenDTO,
  LoginDTO,
} from './dtos';
import { CreateUserDTO } from 'src/user/dtos';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { TokenGeneratorUtilService } from './utils';
import { randomBytes } from 'crypto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  @Inject(PrismaService) private readonly prisma: PrismaService;
  @Inject(UserService) private readonly userService: UserService;
  @Inject(TokenGeneratorUtilService)
  private readonly tokenGenerator: TokenGeneratorUtilService;

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
    const token = this.tokenGenerator.generate({
      id: user.id,
      role: user.role,
    });
    const refreshToken = await this.createRefreshToken({
      token,
      userId: user.id,
    });
    return { token, refreshToken: refreshToken.refreshToken };
  }

  async signupUser(dto: CreateUserDTO) {
    const user = await this.userService.createUser(dto);
    const token = this.tokenGenerator.generate({
      id: user.id,
      role: user.role,
    });
    const refreshToken = await this.createRefreshToken({
      token,
      userId: user.id,
    });
    return { token, refreshToken: refreshToken.refreshToken };
  }

  createRefreshToken(dto: CreateRefreshTokenDTO) {
    const refreshTokenCode = randomBytes(10).toString('hex');
    const expireTime = new Date();
    expireTime.setDate(expireTime.getDate() + 2);

    return this.prisma.refreshToken.create({
      data: {
        refreshToken: refreshTokenCode,
        token: dto.token,
        userId: dto.userId,
        expireTime,
      },
    });
  }

  async getTokenBasedOnRefreshToken(
    user: User,
    dto: GetTokenBasedOnRefreshTokenDTO,
  ) {
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId: user.id,
        token: dto.token,
        refreshToken: dto.refreshToken,
      },
    });

    if (!refreshToken) {
      throw new NotFoundException(
        'اطلاعات وارد شده برای آپدیت کردن نادرست میباشد',
      );
    }

    const today = new Date().getTime();
    if (today > refreshToken.expireTime.getTime()) {
      await this.prisma.refreshToken.delete({ where: { id: refreshToken.id } });
      throw new BadRequestException('کد مربوط به آپدیت توکن منقضی شده است');
    }

    const newToken = this.tokenGenerator.generate({
      id: user.id,
      role: user.role,
    });

    await this.prisma.refreshToken.update({
      where: { id: refreshToken.id },
      data: { token: newToken },
    });

    return { token: newToken, refreshToken: refreshToken.refreshToken };
  }
}
