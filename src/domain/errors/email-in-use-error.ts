export class EmailInUseError extends Error {
  constructor() {
    super('Email já cadastrado');
    this.name = 'EmailInUseError';
  }
}
