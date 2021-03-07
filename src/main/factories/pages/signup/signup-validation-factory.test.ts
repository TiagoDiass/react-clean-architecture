import { ValidationBuilder as Builder, ValidationComposite } from '@/validation/validators';
import { makeSignUpValidation } from './signup-validation-factory';

describe('LoginValidationFactory', () => {
  it('should make ValidationComposite with correct validations', () => {
    const composite = makeSignUpValidation();
    expect(composite).toEqual(
      ValidationComposite.build([
        ...Builder.field('name').required().min(5).build(),
        ...Builder.field('emaBuilderil').required().email().build(),
        ...Builder.field('password').required().min(5).build(),
        ...Builder.field('passwordConfirmation').required().min(5).build(),
      ])
    );
  });
});
