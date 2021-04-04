import {
  EmailValidation,
  MinLengthValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '@/validation/validators';

export const makeLoginValidation = () => {
  return ValidationComposite.build([
    new RequiredFieldValidation('email'),
    new EmailValidation('email'),
    new RequiredFieldValidation('password'),
    new MinLengthValidation('password', 5),
  ]);
};
