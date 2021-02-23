import { EmailValidation, RequiredFieldValidation } from '@/validation/validators';
import { MinLengthValidation } from '../min-length/min-length-validation';
import { ValidationBuilder as sut } from './validation-builder';
import faker from 'faker';

const makeFieldName = () => faker.database.column();

describe('ValidationBuilder', () => {
  it('should return RequiredFieldValidation', () => {
    const fieldName = makeFieldName();
    const validations = sut.field(fieldName).required().build();
    expect(validations).toEqual([new RequiredFieldValidation(fieldName)]);
  });

  it('should return EmailValidation', () => {
    const fieldName = makeFieldName();
    const validations = sut.field(fieldName).email().build();
    expect(validations).toEqual([new EmailValidation(fieldName)]);
  });

  it('should return MinLengthValidation', () => {
    const fieldName = makeFieldName();
    const minLength = faker.random.number();
    const validations = sut.field(fieldName).min(minLength).build();
    expect(validations).toEqual([new MinLengthValidation(fieldName, minLength)]);
  });

  it('should return a list of validations', () => {
    const fieldName = makeFieldName();
    const minLength = faker.random.number();
    const validations = sut.field(fieldName).required().min(minLength).email().build();
    expect(validations).toEqual([
      new RequiredFieldValidation(fieldName),
      new MinLengthValidation(fieldName, minLength),
      new EmailValidation(fieldName),
    ]);
  });
});
