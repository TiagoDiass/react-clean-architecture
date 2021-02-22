import { ValidationComposite } from './validation-composite';
import { FieldValidationSpy } from '@/validation/test';

describe('ValidationComposite', () => {
  test('should return an error if any validation fails', () => {
    const fieldValidationSpy = new FieldValidationSpy('any_field');
    fieldValidationSpy.error = new Error('first_error_message');

    const fieldValidationSpy2 = new FieldValidationSpy('any_field');
    fieldValidationSpy2.error = new Error('second_error_message');

    const sut = new ValidationComposite([fieldValidationSpy, fieldValidationSpy2]);

    const validationError = sut.validate('any_field', 'any_value');

    expect(validationError).toBe('first_error_message');
  });
});
