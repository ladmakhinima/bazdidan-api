import {
  BadRequestException,
  FileTypeValidator,
  HttpStatus,
  Injectable,
  ParseFilePipe,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidateUploadImage
  extends ParseFilePipe
  implements PipeTransform<Express.Multer.File>
{
  constructor() {
    super({
      validators: [new FileTypeValidator({ fileType: '.(png|jpg|jpeg)' })],
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: () =>
        new BadRequestException(
          'باشد jpg , jpeg , png نوع فایل ارسالی باید از جنس ',
        ),
    });
  }
}
