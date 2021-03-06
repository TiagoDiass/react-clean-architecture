import { verifyCurrentUrl, verifyInputStatus, verifyMainError } from '../support/form-helper';
import { mockUnexpectedError } from '../support/http-mocks';
import faker from 'faker';

function testEmailInUseErrorOn403(intercepRequest: boolean) {
  if (intercepRequest) {
    cy.intercept('POST', /signup/, {
      statusCode: 403,
      body: {
        error: faker.random.words(),
      },
    });
  }

  simulateValidSubmit(
    intercepRequest
      ? {}
      : {
          email: 'mango@gmail.com',
        }
  );

  verifyMainError('Email já cadastrado');
  verifyCurrentUrl('/signup');
}

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
    // Não vou fazer esse teste batendo na API de verdade porque pode floodar o banco do Manguinho...
    it('should save the returned account on local storage and redirects to home page if valid data are provided', () => {
      cy.intercept('POST', /signup/, {
        statusCode: 200,
        body: {
          accessToken: faker.random.uuid(),
          name: faker.name.findName(),
        },
      });

      simulateValidSubmit({});

      // mesma coisa que checar se o error-wrapper não tem descendants
      cy.getByTestId('main-error').should('not.exist');
      cy.getByTestId('loading-spinner').should('not.exist');

      verifyCurrentUrl('/');

      cy.window().then((window) => assert.isOk(window.localStorage.getItem('account')));
    });

    it('should present an EmailInUseError on 403', () => {
      testEmailInUseErrorOn403(true);
    });

    it('should present an UnexpectedError on default error cases', () => {
      mockUnexpectedError({ url: /signup/, method: 'POST' });

      simulateValidSubmit({});

      verifyMainError('Parece que algo de errado aconteceu. Tente novamente em breve.');

      verifyCurrentUrl('/signup');
    });

    it('should present an UnexpectedError if an invalid property has been returned by the api', () => {
      cy.intercept('POST', /signup/, {
        statusCode: 200,
        body: {
          invalidProperty: faker.random.words(),
        },
      });

      simulateValidSubmit({});

      verifyMainError('Parece que algo de errado aconteceu. Tente novamente em breve.');

      verifyCurrentUrl('/signup');
    });

    it('should prevent multiple submits', () => {
      cy.intercept('POST', /signup/, {
        statusCode: 200,
        body: {
          accessToken: faker.random.uuid(),
        },
      }).as('request');

      const password = faker.random.alphaNumeric(5);
      cy.getByTestId('name-input').type(faker.name.findName());
      cy.getByTestId('email-input').type(faker.internet.email());
      cy.getByTestId('password-input').type(password);
      cy.getByTestId('passwordConfirmation-input').type(password);
      cy.getByTestId('submit').dblclick();

      cy.get('@request.all').should('have.length', 1);
    });

    it('should prevent submit if form is invalid', () => {
      cy.intercept('POST', /signup/, {
        statusCode: 200,
        body: {
          accessToken: faker.random.uuid(),
        },
      }).as('request');

      cy.getByTestId('email-input').type(faker.internet.email()).type('{enter}');
      cy.get('@request.all').should('have.length', 0);
    });
  });

  describe('not intercepting requests (real API)', () => {
    it('should present an EmailInUseError on 403', () => {
      testEmailInUseErrorOn403(false);
    });
  });
});
