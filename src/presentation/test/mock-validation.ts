import { Validation } from '../protocols';

export class ValidationSpy implements Validation {
  errorMessage: string;
  input: object;
  fieldName: string;
  fieldValue: string;

  validate(fieldName: string, fieldValue: string): string {
    this.fieldName = fieldName;
    this.fieldValue = fieldValue;
    return this.errorMessage;
  }
}
