import { InvalidFieldError } from '@/validation/errors';
import { FieldValidation } from '@/validation/protocols';

export class MinLengthValidation implements FieldValidation {
  constructor(readonly field, private readonly minLength: number) {}

  validate(value: string): Error {
    return value.length < this.minLength ? new InvalidFieldError(this.field) : null;
  }
}
