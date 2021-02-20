export class InvalidFieldError extends Error {
  constructor(fieldLabel: string) {
    super(`Campo ${fieldLabel} está com valor inválido`);
    this.name = 'InvalidFieldError';
  }
}
