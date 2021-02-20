import { FieldValidation } from '@/validation/protocols';
import faker from 'faker';

class InvalidFieldError extends Error {
  constructor() {
    super('Campo preenchido com valor inválido');
    this.name = 'InvalidFieldError';
  }
}

class EmailValidation implements FieldValidation {
  constructor(readonly field: string) {}

  validate(value: string): InvalidFieldError {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(value).toLowerCase()) ? null : new InvalidFieldError();
  }
}

describe('EmailValidation', () => {
  it('should return an error if email is invalid', () => {
    const sut = new EmailValidation('email');
    const error = sut.validate('any_email');
    expect(error).toEqual(new InvalidFieldError());
  });

  it('should return falsy if email is valid', () => {
    const sut = new EmailValidation('email');
    const valdationError = sut.validate(faker.internet.email());
    expect(valdationError).toBeFalsy();
  });
});
