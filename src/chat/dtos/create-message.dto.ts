import { Chat, HouseAd, User } from '@prisma/client';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMessageDTO {
  @IsNotEmpty({ message: 'پر کردن دریافت کننده الزامی میباشد' })
  @IsInt({ message: 'دریافت کننده باید آیدی باشد' })
  receiver: number | User;

  @IsNotEmpty({ message: 'پر کردن ارسال کننده الزامی میباشد' })
  @IsInt({ message: 'ارسال کننده باید آیدی باشد' })
  sender: number | User;

  @IsNotEmpty({ message: 'ارسال متن پیام الزامی میباشد' })
  @IsString({ message: 'متن پیام باید رشته باشد' })
  content: string;

  @IsOptional()
  @IsString({
    each: true,
    message: 'فایل های پیوست درقالب لیستی از رشته باید ارسال شوند',
  })
  @IsArray({
    message: 'فایل های پیوست باید درقالب لیستی از رشته ها ارسال گردد',
  })
  attachments: string[];

  @IsNotEmpty({ message: 'آگهی ملکی مربوط به پیام الزامی میباشد' })
  @IsInt({ message: 'آگهی ملکی باید درقالب آیدی ارسال گردد' })
  houseAd: number | HouseAd;

  @IsOptional()
  @IsInt({ message: 'پیام ریپلای شده باید درقالب آیدی ارسال گردد' })
  parent: number | Chat;
}
