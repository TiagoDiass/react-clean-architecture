import { EmailValidation } from './email-validation';
import { InvalidFieldError } from '@/validation/errors';
import faker from 'faker';

const fieldName = faker.database.column();
const makeSut = () => new EmailValidation(fieldName);

describe('EmailValidation', () => {
  it('should return an error if email is invalid', () => {
    const sut = makeSut();
    const validationError = sut.validate(faker.random.word());
    expect(validationError).toEqual(new InvalidFieldError(fieldName));
    expect(validationError.message).toBe(`Campo ${fieldName} está com valor inválido`);
  });

  it('should return falsy if email is valid', () => {
    const sut = makeSut();
    const validationError = sut.validate(faker.internet.email());
    expect(validationError).toBeFalsy();
  });

  it('should return falsy if email is empty', () => {
    const sut = makeSut();
    const validationError = sut.validate('');
    expect(validationError).toBeFalsy();
  });
});
