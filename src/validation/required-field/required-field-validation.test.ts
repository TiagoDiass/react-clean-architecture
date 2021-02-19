import { RequiredFieldValidation } from './required-field-validation';
import { RequiredFieldError } from '@/validation/errors';
import faker from 'faker';

const makeSut = () => new RequiredFieldValidation(faker.database.column());

describe('RequiredFieldValidation', () => {
  it('should return an error if field is empty', () => {
    const sut = makeSut();
    const error = sut.validate('');
    expect(error).toEqual(new RequiredFieldError());
  });

  it('should return falsy if field is not empty', () => {
    const sut = makeSut();
    const error = sut.validate(faker.random.word());
    expect(error).toBeFalsy();
  });
});
