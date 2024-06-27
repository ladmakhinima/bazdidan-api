import {
  BadRequestException,
  ExecutionContext,
  FileTypeValidator,
  HttpStatus,
  Injectable,
  ParseFilePipe,
  PipeTransform,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ValidateUploadImage
  extends ParseFilePipe
  implements PipeTransform<Express.Multer.File>
{
  constructor(private reflect: Reflector) {
    super({
      validators: [new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' })],
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: () =>
        new BadRequestException(
          'باشد jpg , jpeg , png نوع فایل ارسالی باید از جنس ',
        ),
    });
  }

  async transform(value: Express.Multer.File): Promise<Express.Multer.File> {
    const isRequired = this.reflect.get<boolean>(
      'IS_FILE_REQUIRE',
      this._getContext,
    );

    if (isRequired && !value) {
      throw new BadRequestException('ارسال فایل الزامی میباشد');
    }

    return value;
  }

  private _getContext(context: ExecutionContext) {
    return context.getHandler();
  }
}
