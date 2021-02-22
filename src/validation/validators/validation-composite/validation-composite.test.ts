import { ValidationComposite } from './validation-composite';
import { FieldValidationSpy } from '@/validation/test';
import faker from 'faker';

type SutTypes = {
  sut: ValidationComposite;
  fieldValidationSpies: FieldValidationSpy[];
};

const makeSut = (fieldName: string): SutTypes => {
  const fieldValidationSpies = [
    new FieldValidationSpy(fieldName),
    new FieldValidationSpy(fieldName),
  ];

  const sut = new ValidationComposite(fieldValidationSpies);

  return {
    sut,
    fieldValidationSpies,
  };
};

describe('ValidationComposite', () => {
  it('should return an error if any validation fails', () => {
    const fieldName = faker.database.column();
    const { sut, fieldValidationSpies } = makeSut(fieldName);
    const errorMessage = faker.random.words();

    fieldValidationSpies[0].error = new Error(errorMessage);
    fieldValidationSpies[1].error = new Error('second_error_message');

    const validationError = sut.validate(fieldName, faker.random.word());

    expect(validationError).toBe(errorMessage);
  });

  it('should return falsy if all validation succeeds', () => {
    const fieldName = faker.database.column();
    const { sut } = makeSut(fieldName);
    const validationError = sut.validate(fieldName, faker.random.word());

    expect(validationError).toBeFalsy();
  });
});
