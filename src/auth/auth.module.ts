import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWT_EXP, JWT_KEY } from 'src/constants/env.constant';
import { JwtStrategy } from './strategies';
import { AccessTokenGuard } from './guards';
import { TokenGeneratorUtilService } from './utils';

@Module({
  exports: [],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    AccessTokenGuard,
    TokenGeneratorUtilService,
  ],
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>(JWT_KEY),
          signOptions: { expiresIn: configService.get<string>(JWT_EXP) },
        };
      },
    }),
  ],
})
export class AuthModule {}
