import { IsNotEmpty, IsString } from 'class-validator';

export class GetTokenBasedOnRefreshTokenDTO {
  @IsNotEmpty({ message: 'توکن احراز هویت الزامی میباشد' })
  @IsString()
  token: string;

  @IsNotEmpty({ message: 'رفرش توکن الزامی میباشد' })
  @IsString()
  refreshToken: string;
}
