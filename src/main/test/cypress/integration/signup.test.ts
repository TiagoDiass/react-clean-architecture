import { verifyInputStatus } from '../support/form-helper';
import faker from 'faker';

describe('SignUp', () => {
  beforeEach(() => {
    cy.viewport(1000, 900);
    cy.visit('signup');
  });

  it('should load with correct initial state', () => {
    const error = 'Campo obrigatório';

    verifyInputStatus({ fieldName: 'name', inputStatus: 'initial', error });
    verifyInputStatus({ fieldName: 'email', inputStatus: 'initial', error });
    verifyInputStatus({ fieldName: 'password', inputStatus: 'initial', error });
    verifyInputStatus({ fieldName: 'passwordConfirmation', inputStatus: 'initial', error });

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrapper').should('not.have.descendants');
    cy.getByTestId('email-input').should('have.value', '');
    cy.getByTestId('password-input').should('have.value', '');
  });

  it('should present an error state if form is invalid', () => {
    const error = 'Valor inválido';

    cy.getByTestId('name-input').type(faker.random.alphaNumeric(4));
    verifyInputStatus({ fieldName: 'name', error, inputStatus: 'invalid' });

    cy.getByTestId('email-input').type(faker.random.word());
    verifyInputStatus({ fieldName: 'email', error, inputStatus: 'invalid' });

    cy.getByTestId('password-input').type(faker.random.alphaNumeric(3));
    verifyInputStatus({ fieldName: 'password', error, inputStatus: 'invalid' });

    cy.getByTestId('passwordConfirmation-input').type(faker.random.alphaNumeric(4));
    verifyInputStatus({ fieldName: 'passwordConfirmation', error, inputStatus: 'invalid' });

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrapper').should('not.have.descendants');
  });
});
