import { RequiredFieldValidation } from './required-field-validation';
import { RequiredFieldError } from '@/validation/errors';
import faker from 'faker';

const makeSut = (fieldName: string) => new RequiredFieldValidation(fieldName);

describe('RequiredFieldValidation', () => {
  it('should return an error if field is empty', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const error = sut.validate({ [fieldName]: '' });
    expect(error).toEqual(new RequiredFieldError());
  });

  it('should return falsy if field is not empty', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const error = sut.validate({ [fieldName]: faker.random.word() });
    expect(error).toBeFalsy();
  });
});
