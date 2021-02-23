import { MinLengthValidation } from './min-length-validation';
import { InvalidFieldError } from '@/validation/errors';
import faker from 'faker';

const fieldName = faker.database.column();

const makeSut = () => new MinLengthValidation(fieldName, 5);

describe('MinLenghtValidation', () => {
  it('should return an error if value doesnt have the min length', () => {
    const sut = makeSut();
    const validationError = sut.validate(faker.random.alphaNumeric(4));
    expect(validationError).toEqual(new InvalidFieldError());
  });

  it('should return falsy if value has the min length', () => {
    const sut = makeSut();
    const validationError = sut.validate(faker.random.alphaNumeric(5));
    expect(validationError).toBeFalsy();
  });
});
