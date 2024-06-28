import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty({ message: 'تایتل مربوط به دسته بندی الزامی میباشد' })
  @IsString({ message: 'تایتل مربوط به دسته بندی الزامی میباشد' })
  @MinLength(2, { message: 'تایتل حداقل باید تشکیل شده از 2 کاراکتر باشد' })
  title: string;

  @Transform(({ value }) => `${value}` === 'true')
  @IsNotEmpty({ message: 'وضعیت نمایشی دسته بندی را مشخص کنید' })
  @IsBoolean({ message: 'وضعیت دسته بندی درقالب بولین باید باشد' })
  isVisible: boolean;
}
