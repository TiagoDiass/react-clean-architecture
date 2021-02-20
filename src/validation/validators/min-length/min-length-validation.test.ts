import { MinLengthValidation } from './min-length-validation';
import { InvalidFieldError } from '@/validation/errors';

describe('MinLenghtValidation', () => {
  it('should return an error if value doesnt have the min length', () => {
    const sut = new MinLengthValidation('field', 5);
    const validationError = sut.validate('123');

    expect(validationError).toEqual(new InvalidFieldError('field'));
  });
});
