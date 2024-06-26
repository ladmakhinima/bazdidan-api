import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWT_EXP, JWT_KEY } from 'src/constants/env.constant';

@Injectable()
export class TokenGeneratorUtilService {
  @Inject(JwtService) private readonly jwtService: JwtService;
  @Inject(ConfigService) private readonly configService: ConfigService;

  generate(payload: object) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(JWT_KEY),
      expiresIn: this.configService.get<string>(JWT_EXP),
    });
  }
}
