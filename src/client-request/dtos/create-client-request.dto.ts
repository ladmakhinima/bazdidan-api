import { HouseAdType, HouseType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateClientRequestDTO {
  @IsOptional()
  @IsEnum(HouseAdType, { message: 'نوع آگهی وارد شده نادرست میباشد' })
  type?: HouseAdType;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'فرمت قیمت براساس هر متر نادرست میباشد' },
  )
  pricePerMarket?: number;

  @IsOptional()
  @IsEnum(HouseType, {
    message: 'مقدار وارد شده برای مدل آگهی خانه نادرست میباشد',
  })
  houseType?: HouseType;

  @IsOptional()
  @IsString({ message: 'سال ساخت را وارد کنید' })
  yearOfConstruction?: string;

  @IsOptional()
  @IsInt({ message: 'فرمت وارد شده برای متراژ خانه نادرست میباشد' })
  meterage?: number;

  @IsOptional()
  @IsInt({ message: 'فرمت تعداد اتاق های خانه نادرست میباشد' })
  roomNumber?: number;

  @IsOptional()
  @IsString({ each: true })
  @IsArray({ message: 'آپشن ها باید لیستی از رشته باشد' })
  options?: string[];

  @IsOptional()
  @IsInt({ message: 'فرمت وارد شده برای آژانس ملکی نادرست میباشد' })
  estateAgencyId?: number;
}
