import {
  IsBoolean,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { BioCheckerValidator } from '../validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'وارد کردن نام کاربر الزامی میباشد' })
  @IsString()
  @MinLength(3, {
    message: 'نام کاربر باید حداقل تشکیل شده از 3 حرف باشد',
  })
  firstName: string;

  @IsNotEmpty({ message: 'وارد کردن نام خانوادگی کاربر الزامی میباشد' })
  @IsString()
  @MinLength(3, {
    message: 'نام خانوادگی کاربر باید حداقل تشکیل شده از 3 حرف باشد',
  })
  lastName: string;

  @IsNotEmpty({ message: 'وارد کردن شماره تماس کاربر الزامی میباشد' })
  @IsString()
  @IsPhoneNumber('IR', { message: 'شماره تماس وارد شده فرمت نادرستی دارد' })
  phone: string;

  @IsNotEmpty({ message: 'وارد کردن گذرواژه کاربر الزامی میباشد' })
  @IsString()
  @MinLength(8, {
    message: 'گذرواژه کاربر باید حداقل تشکیل شده از 8 حرف باشد',
  })
  password: string;

  @IsNotEmpty({ message: 'کاربر باید عکس پروفایل داشته باشد' })
  profile: string;

  @Validate(BioCheckerValidator)
  bio?: string;

  @IsNotEmpty()
  @IsBoolean({ message: 'مشخص کردن کاربر یا مشاور املاک بودن الزامی میباشد' })
  isClient: boolean;
}
