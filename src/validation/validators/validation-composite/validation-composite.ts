import { Validation } from '@/presentation/protocols';
import { FieldValidation } from '@/validation/protocols';

export class ValidationComposite implements Validation {
  private constructor(private readonly validators: FieldValidation[]) {}

  static build(validators: FieldValidation[]) {
    return new ValidationComposite(validators);
  }

  validate(fieldName: string, input: object): string {
    const validators = this.validators.filter((validator) => validator.field === fieldName);

    for (const validator of validators) {
      const validationError = validator.validate(input);

      if (validationError) {
        return validationError.message;
      }
    }
  }
}
