import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CreateUserDTO } from '../dtos';

@ValidatorConstraint({ name: 'BioChecker', async: false })
@Injectable()
export class BioCheckerValidator implements ValidatorConstraintInterface {
  validate(value: string, validationArguments?: ValidationArguments): boolean {
    const dto = validationArguments.object as CreateUserDTO;
    return !(dto.isClient && !value);
  }
  defaultMessage?(): string {
    return 'مشاور املاک باید خلاصه ای از خود را وارد کند';
  }
}
