import { RequiredFieldValidation } from '../required-field/required-field-validation';
import { ValidationBuilder } from './validation-builder';

describe('ValidationBuilder', () => {
  it('should return RequiredFieldValidation', () => {
    const validations = ValidationBuilder.field('any_field').required().build();
    expect(validations).toEqual([new RequiredFieldValidation('any_field')]);
  });
});
