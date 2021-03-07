import { FieldValidation } from '@/validation/protocols';
import { InvalidFieldError } from '@/validation/errors';

export class CompareFieldsValidation implements FieldValidation {
  constructor(readonly field: string, private readonly fieldToCompare: string) {}

  validate(input: object): Error {
    const value = input[this.field];
    const valueToCompare = input[this.fieldToCompare];

    return value !== valueToCompare ? new InvalidFieldError() : null;
  }
}
