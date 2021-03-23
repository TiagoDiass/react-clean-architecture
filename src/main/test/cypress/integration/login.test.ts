import { verifyInputStatus, verifyMainError, verifyCurrentUrl } from '../support/form-helper';
import { mockUnexpectedError } from '../support/http-mocks';
import faker from 'faker';

function testInvalidCredentialsOnStatus401(intercepRequest: boolean) {
  if (intercepRequest) {
    cy.intercept('POST', /login/, {
      statusCode: 401,
      body: {
        error: faker.random.words(),
      },
    });
  }

  simulateValidSubmit({});

  verifyMainError('Credenciais inválidas');

  verifyCurrentUrl('/login');
}

function testSaveAccessTokenAndRedirectsToHome(intercepRequest: boolean) {
  if (intercepRequest) {
    cy.intercept('POST', /login/, {
      statusCode: 200,
      body: {
        accessToken: faker.random.uuid(),
        name: faker.name.findName(),
      },
    });
  }

  simulateValidSubmit({
    email: intercepRequest ? faker.internet.email() : 'mango@gmail.com',
    password: intercepRequest ? faker.random.alphaNumeric(6) : '12345',
  });

  // mesma coisa que checar se o error-wrapper não tem descendants
  cy.getByTestId('main-error').should('not.exist');
  cy.getByTestId('loading-spinner').should('not.exist');

  verifyCurrentUrl('/');

  cy.window().then((window) => assert.isOk(window.localStorage.getItem('account')));
}

type SimulateValidSubmitParams = {
  email?: string;
  password?: string;
};

function simulateValidSubmit({
  email = faker.internet.email(),
  password = faker.random.alphaNumeric(5),
}: SimulateValidSubmitParams) {
  cy.getByTestId('email-input').type(email);
  cy.getByTestId('password-input').type(password);
  cy.getByTestId('submit').click();
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login');
  });

  it('should load with correct initial state', () => {
    const error = 'Campo obrigatório';

    verifyInputStatus({ fieldName: 'email', inputStatus: 'initial', error });
    verifyInputStatus({ fieldName: 'password', inputStatus: 'initial', error });

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrapper').should('not.have.descendants');
    cy.getByTestId('email-input').should('have.value', '');
    cy.getByTestId('password-input').should('have.value', '');
  });

  it('should present an error state if form is invalid', () => {
    const error = 'Valor inválido';

    cy.getByTestId('email-input').type(faker.random.word());
    verifyInputStatus({ fieldName: 'email', error, inputStatus: 'invalid' });

    cy.getByTestId('password-input').type(faker.random.alphaNumeric(3));
    verifyInputStatus({ fieldName: 'password', error, inputStatus: 'invalid' });

    cy.getByTestId('submit').should('have.attr', 'disabled');
    cy.getByTestId('error-wrapper').should('not.have.descendants');
  });

  it('should present a valid state if form is valid', () => {
    cy.getByTestId('email-input').type(faker.internet.email());
    verifyInputStatus({ fieldName: 'email', inputStatus: 'valid' });

    cy.getByTestId('password-input').type(faker.random.alphaNumeric(5));
    verifyInputStatus({ fieldName: 'password', inputStatus: 'valid' });

    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrapper').should('not.have.descendants');
  });

  describe('intercepting requests', () => {
    it('should save the returned account and redirects to home page if valid credentials are provided', () => {
      testSaveAccessTokenAndRedirectsToHome(true);
    });

    it('should present an InvalidCredentialsError on response of status 401', () => {
      testInvalidCredentialsOnStatus401(true);
    });

    it('should present an UnexpectedError on default error cases', () => {
      mockUnexpectedError({ url: /login/, method: 'POST' });

      simulateValidSubmit({});

      verifyMainError('Parece que algo de errado aconteceu. Tente novamente em breve.');

      verifyCurrentUrl('/login');
    });

    it('should present an UnexpectedError if an invalid property has been returned by the api', () => {
      cy.intercept('POST', /login/, {
        statusCode: 200,
        body: {
          invalidProperty: faker.random.words(),
        },
      });

      simulateValidSubmit({});

      verifyMainError('Parece que algo de errado aconteceu. Tente novamente em breve.');

      verifyCurrentUrl('/login');
    });

    it('should prevent multiple submits', () => {
      cy.intercept('POST', /login/, {
        statusCode: 200,
        body: {
          accessToken: faker.random.uuid(),
        },
      }).as('request');

      cy.getByTestId('email-input').type(faker.internet.email());
      cy.getByTestId('password-input').type(faker.random.alphaNumeric(5));
      cy.getByTestId('submit').dblclick();
      cy.get('@request.all').should('have.length', 1);
    });

    it('should prevent submit if form is invalid', () => {
      cy.intercept('POST', /login/, {
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
    it('should save the returned account and redirects to home page if valid credentials are provided', () => {
      testSaveAccessTokenAndRedirectsToHome(false);
    });

    it('should present an InvalidCredentialsError on response of status 401', () => {
      testInvalidCredentialsOnStatus401(false);
    });
  });
});
