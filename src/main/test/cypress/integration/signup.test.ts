import { verifyCurrentUrl, verifyInputStatus, verifyMainError } from '../support/form-helper';
import faker from 'faker';

type SimulateValidSubmitParams = {
  name?: string;
  email?: string;
  password?: string;
};

function simulateValidSubmit({
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.random.alphaNumeric(7),
}: SimulateValidSubmitParams) {
  cy.getByTestId('name-input').type(name);
  cy.getByTestId('email-input').type(email);
  cy.getByTestId('password-input').type(password);
  cy.getByTestId('passwordConfirmation-input').type(password);
  cy.getByTestId('submit').click();
}

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

  it('should present a valid state if form is valid', () => {
    cy.getByTestId('name-input').type(faker.name.findName());
    verifyInputStatus({ fieldName: 'name', inputStatus: 'valid' });

    cy.getByTestId('email-input').type(faker.internet.email());
    verifyInputStatus({ fieldName: 'email', inputStatus: 'valid' });

    const password = faker.random.alphaNumeric(5);

    cy.getByTestId('password-input').type(password);
    verifyInputStatus({ fieldName: 'password', inputStatus: 'valid' });

    cy.getByTestId('passwordConfirmation-input').type(password);
    verifyInputStatus({ fieldName: 'password', inputStatus: 'valid' });

    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrapper').should('not.have.descendants');
  });

  describe('intercepting requests', () => {
    it('should present an EmailInUseError on 403', () => {
      cy.intercept('POST', /signup/, {
        statusCode: 403,
        body: {
          error: faker.random.words(),
        },
      });

      simulateValidSubmit({});

      verifyMainError('Email já cadastrado');
      verifyCurrentUrl('/signup');
    });
  });
});
