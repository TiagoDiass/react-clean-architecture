import { InvalidFieldError } from '@/validation/errors';
import { FieldValidation } from '@/validation/protocols';

export class EmailValidation implements FieldValidation {
  constructor(readonly field: string) {}

  validate(input: object): InvalidFieldError {
    const value = input[this.field];
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !value || regex.test(String(value).toLowerCase()) ? null : new InvalidFieldError();
  }
}
