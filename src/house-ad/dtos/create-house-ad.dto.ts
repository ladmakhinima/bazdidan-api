import { Category, EstateAgency, HouseAdType, HouseType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateHouseAdDTO {
  @IsNotEmpty({ message: 'موضوع آگهی الزامی میباشد' })
  @IsString()
  @MinLength(3, { message: 'موضوع آگهی باید حداقل از 3 حرف تشکیل شده باشد' })
  title: string;

  @IsNotEmpty({ message: 'دسته بندی مربوط به آگهی الزامی میباشد' })
  @IsInt()
  category: number | Category;

  @IsNotEmpty({ message: 'نوع آگهی الزامی میباشد' })
  @IsEnum(HouseAdType, { message: 'نوع آگهی وارد شده نادرست میباشد' })
  type: HouseAdType;

  @IsNotEmpty({ message: 'قیمت براساس هر متر الزامی میباشد' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'فرمت قیمت براساس هر متر نادرست میباشد' },
  )
  pricePerMeter: number;

  @IsNotEmpty({ message: 'توضیحات آگهی الزامی میباشد' })
  @IsString()
  @MinLength(20, {
    message: 'توضیحات آگهی باید حداقل از 20 حرف تشکیل شده باشد',
  })
  description: string;

  @IsNotEmpty({ message: 'سال ساخت خانه الزامی میباشد' })
  @IsString({ message: 'سال ساخت را وارد کنید' })
  yearOfConstruction: string;

  @IsNotEmpty({ message: 'فایل های پیوست مربوط به آگهی الزامی میباشد' })
  @IsString({ each: true })
  @IsArray({ message: 'فایل های پیوست باید لیستی از رشته ها باشد' })
  attachments: string[];

  @IsNotEmpty({ message: 'متراژ خانه الزامی میباشد' })
  @IsInt({ message: 'فرمت وارد شده برای متراژ خانه نادرست میباشد' })
  meterage: number;

  @IsNotEmpty({ message: 'تعداد اتاق های خانه الزامی میباشد' })
  @IsInt({ message: 'فرمت تعداد اتاق های خانه نادرست میباشد' })
  roomNumber: number;

  @IsNotEmpty({ message: 'آدرس آگهی الزامی میباشد' })
  @IsString()
  @MinLength(20, {
    message: 'آدرس آگهی باید حداقل از 20 حرف تشکیل شده باشد',
  })
  address: string;

  @IsNotEmpty({ message: 'مدل آگهی خانه الزامی میباشد' })
  @IsEnum(HouseType, {
    message: 'مقدار وارد شده برای مدل آگهی خانه نادرست میباشد',
  })
  houseType: HouseType;

  @IsNotEmpty({ message: 'آژانس ملکی الزامی میباشد' })
  @IsInt({ message: 'فرمت وارد شده برای آژانس ملکی نادرست میباشد' })
  estateAgency: number | EstateAgency;

  @IsNotEmpty({ message: 'آپشن های مربوط به خانه الزامی میباشد' })
  @IsString({ each: true })
  @IsArray({ message: 'آپشن ها باید لیستی از رشته باشد' })
  options: string[];
}
