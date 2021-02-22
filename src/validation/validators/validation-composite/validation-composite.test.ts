import { ValidationComposite } from './validation-composite';
import { FieldValidationSpy } from '@/validation/test';

describe('ValidationComposite', () => {
  test('should return an error if validation fails', () => {
    const fieldValidationSpy = new FieldValidationSpy('any_field');
    const fieldValidationSpy2 = new FieldValidationSpy('any_field');
    fieldValidationSpy2.error = new Error('any_error_message');

    const sut = new ValidationComposite([fieldValidationSpy, fieldValidationSpy2]);

    const validationError = sut.validate('any_field', 'any_value');

    expect(validationError).toBe('any_error_message');
  });
});
