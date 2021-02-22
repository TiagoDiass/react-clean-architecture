import { Validation } from '@/presentation/protocols';
import { FieldValidation } from '@/validation/protocols';

export class ValidationComposite implements Validation {
  constructor(private readonly validators: FieldValidation[]) {}

  validate(fieldName: string, fieldValue: string): string {
    const validators = this.validators.filter((validator) => validator.field === fieldName);

    for (const validator of validators) {
      const validationError = validator.validate(fieldValue);

      if (validationError) {
        return validationError.message;
      }
    }
  }
}
