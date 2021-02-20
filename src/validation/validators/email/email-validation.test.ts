import { EmailValidation } from './email-validation';
import { InvalidFieldError } from '@/validation/errors';
import faker from 'faker';

const makeSut = () => new EmailValidation('email');

describe('EmailValidation', () => {
  it('should return an error if email is invalid', () => {
    const sut = makeSut();
    const validationError = sut.validate('invalid_email');
    expect(validationError).toEqual(new InvalidFieldError('E-mail'));
  });

  it('should return falsy if email is valid', () => {
    const sut = makeSut();
    const validationError = sut.validate(faker.internet.email());
    expect(validationError).toBeFalsy();
  });
});
