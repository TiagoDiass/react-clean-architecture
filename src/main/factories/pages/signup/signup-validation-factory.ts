import { ValidationBuilder as Builder, ValidationComposite } from '@/validation/validators';

export const makeSignUpValidation = () => {
  return ValidationComposite.build([
    ...Builder.field('name').required().min(5).build(),
    ...Builder.field('emaBuilderil').required().email().build(),
    ...Builder.field('password').required().min(5).build(),
    ...Builder.field('passwordConfirmation').required().min(5).build(),
  ]);
};
