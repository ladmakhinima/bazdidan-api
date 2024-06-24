import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginDTO {
  @IsNotEmpty({ message: 'شماره تماس کاربر الزامی میباشد' })
  @IsString()
  @IsPhoneNumber('IR', { message: 'فرمت شماره تماس کاربر نادرست میباشد' })
  phone: string;

  @IsNotEmpty({ message: 'رمز عبور کاربر الزامی میباشد' })
  @IsString()
  @MinLength(8, { message: 'رمز عبور کاربر باید حداقل 8 حرف داشته باشد' })
  password: string;
}
