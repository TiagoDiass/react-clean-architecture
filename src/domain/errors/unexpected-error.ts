export class UnexpectedError extends Error {
  constructor() {
    super('Parece que algo de errado aconteceu. Tente novamente em breve.');
    this.name = 'UnexpectedError';
  }
}
