import { verifyInputStatus } from '../support/form-helper';

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
});
