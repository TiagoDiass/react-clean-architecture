import { CompareFieldsValidation } from './compare-fields-validation';
import { InvalidFieldError } from '@/validation/errors';
import faker from 'faker';

const makeSut = (valueToCompare: string) =>
  new CompareFieldsValidation(faker.database.column(), valueToCompare);

describe('CompareFieldsValidation', () => {
  it('should return an error if compare is invalid', () => {
    const sut = makeSut(faker.random.word());
    const error = sut.validate(faker.random.word());
    expect(error).toEqual(new InvalidFieldError());
  });
});
