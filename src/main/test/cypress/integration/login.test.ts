import faker from 'faker';

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login');
  });

  it('should load with correct initial state', () => {
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('contain.text', '🔴');

    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('contain.text', '🔴');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrapper').should('not.have.descendants');
    cy.getByTestId('email-input').should('have.value', '');
    cy.getByTestId('password-input').should('have.value', '');
  });

  it('should present an error state if form is invalid', () => {
    cy.getByTestId('email-input').type(faker.random.word());
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴');

    cy.getByTestId('password-input').type(faker.random.alphaNumeric(3));
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴');

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrapper').should('not.have.descendants');
  });
});
