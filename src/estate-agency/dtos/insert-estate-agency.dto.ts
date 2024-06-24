import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class InsertEstateAgencyDTO {
  @IsNotEmpty({ message: 'وارد کردن نام مدیر آژانس اجباری میباشد' })
  @IsString()
  @MinLength(3, {
    message: 'نام مدیر آژانس باید حداقل تشکیل شده از 3 حرف باشد',
  })
  managerName: string;

  @IsNotEmpty({ message: 'وارد کردن نام آژانس اجباری میباشد' })
  @IsString()
  @MinLength(3, {
    message: 'نام آژانس باید حداقل تشکیل شده از 3 حرف باشد',
  })
  name: string;

  @IsNotEmpty({ message: 'وارد کردن آدرس آژانس اجباری میباشد' })
  @IsString()
  @MinLength(20, {
    message: 'آدرس آژانس باید حداقل تشکیل شده از 20 حرف باشد',
  })
  address: string;

  @IsNotEmpty({ message: 'وارد کردن لوگو آژانس اجباری میباشد' })
  logo: string;

  @IsNotEmpty({ message: 'وارد کردن شماره تماس آژانس اجباری میباشد' })
  phone: string;
}
