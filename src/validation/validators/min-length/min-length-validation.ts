import { InvalidFieldError } from '@/validation/errors';
import { FieldValidation } from '@/validation/protocols';

export class MinLengthValidation implements FieldValidation {
  constructor(readonly field: string, private readonly minLength: number) {}

  validate(input: object): Error {
    const value = input[this.field];
    return value?.length < this.minLength ? new InvalidFieldError() : null;
  }
}
