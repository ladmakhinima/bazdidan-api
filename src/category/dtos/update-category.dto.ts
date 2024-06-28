import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoryDTO {
  @IsOptional()
  @IsString({ message: 'تایتل مربوط به دسته بندی الزامی میباشد' })
  @MinLength(2, { message: 'تایتل حداقل باید تشکیل شده از 2 کاراکتر باشد' })
  title: string;

  @Transform(({ value }) => `${value}` === 'true')
  @IsOptional()
  @IsBoolean({ message: 'وضعیت دسته بندی درقالب بولین باید باشد' })
  isVisible: boolean;

  image: string;
}
