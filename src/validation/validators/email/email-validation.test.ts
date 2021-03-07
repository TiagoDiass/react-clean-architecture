import { EmailValidation } from './email-validation';
import { InvalidFieldError } from '@/validation/errors';
import faker from 'faker';

const makeSut = (fieldName: string) => new EmailValidation(fieldName);

describe('EmailValidation', () => {
  it('should return an error if email is invalid', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const validationError = sut.validate({ [fieldName]: faker.random.word() });
    expect(validationError).toEqual(new InvalidFieldError());
    expect(validationError.message).toBe('Valor inválido');
  });

  it('should return falsy if email is valid', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const validationError = sut.validate({ [fieldName]: faker.internet.email() });
    expect(validationError).toBeFalsy();
  });

  it('should return falsy if email is empty', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const validationError = sut.validate({ [fieldName]: '' });
    expect(validationError).toBeFalsy();
  });
});
