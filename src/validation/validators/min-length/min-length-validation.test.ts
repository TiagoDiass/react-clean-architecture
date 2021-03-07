import { MinLengthValidation } from './min-length-validation';
import { InvalidFieldError } from '@/validation/errors';
import faker from 'faker';

const makeSut = (fieldName: string) => new MinLengthValidation(fieldName, 5);

describe('MinLenghtValidation', () => {
  it('should return an error if value doesnt have the min length', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const validationError = sut.validate({ [fieldName]: faker.random.alphaNumeric(4) });
    expect(validationError).toEqual(new InvalidFieldError());
  });

  it('should return falsy if value has the min length', () => {
    const fieldName = faker.database.column();
    const sut = makeSut(fieldName);
    const validationError = sut.validate({ [fieldName]: faker.random.alphaNumeric(5) });
    expect(validationError).toBeFalsy();
  });

  it('should return falsy if field does not exist on input schema', () => {
    const sut = makeSut(faker.database.column());
    const validationError = sut.validate({
      [faker.database.column()]: faker.random.alphaNumeric(5),
    });
    expect(validationError).toBeFalsy();
  });
});
