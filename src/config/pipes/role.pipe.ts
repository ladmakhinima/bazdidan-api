import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RolePipe implements PipeTransform {
  transform(value: string) {
    if (value !== 'client' && value !== 'estate_consultant') {
      throw new BadRequestException('نقش کاربر نادرست میباشد');
    }
    return value.toUpperCase();
  }
}
