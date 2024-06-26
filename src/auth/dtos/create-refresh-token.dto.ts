import { IsInt, IsString } from 'class-validator';

export class CreateRefreshTokenDTO {
  @IsString()
  token: string;

  @IsInt()
  userId: number;
}
