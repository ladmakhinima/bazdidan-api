import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { JWT_KEY } from 'src/constants/env.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(PrismaService) private readonly prismaService: PrismaService;

  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_KEY),
    });
  }

  async validate({ id, role }: { id: number; role: UserRole }) {
    const user = await this.prismaService.user.findFirst({
      where: { id, role },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
