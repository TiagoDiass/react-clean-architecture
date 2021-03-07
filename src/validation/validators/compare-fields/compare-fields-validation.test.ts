import { CompareFieldsValidation } from './compare-fields-validation';
import { InvalidFieldError } from '@/validation/errors';
import faker from 'faker';

const makeSut = (fieldName: string, fieldToCompare: string) =>
  new CompareFieldsValidation(fieldName, fieldToCompare);

describe('CompareFieldsValidation', () => {
  it('should return an error if compare is invalid', () => {
    const fieldName = faker.database.column();
    const fieldToCompare = faker.database.column();

    const sut = makeSut(fieldName, fieldToCompare);
    const error = sut.validate({
      [fieldName]: faker.random.word(),
      [fieldToCompare]: faker.random.word(),
    });

    expect(error).toEqual(new InvalidFieldError());
  });

  it('should return falsy if compare is valid', () => {
    const fieldName = faker.database.column();
    const fieldToCompare = faker.database.column();
    const fieldToCompareValue = faker.random.word();

    const sut = makeSut(fieldName, fieldToCompare);
    const error = sut.validate({
      [fieldName]: fieldToCompareValue,
      [fieldToCompare]: fieldToCompareValue,
    });
    expect(error).toBeFalsy();
  });
});
