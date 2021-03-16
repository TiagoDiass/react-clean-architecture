import faker from 'faker';

const baseUrl: string = Cypress.config().baseUrl;

function testInvalidCredentialsOnStatus401(intercepRequest: boolean) {
  if (intercepRequest) {
    cy.intercept('POST', /login/, {
      statusCode: 401,
      body: {
        error: faker.random.words(),
      },
    });
  }

  cy.getByTestId('email-input').type(faker.internet.email());
  cy.getByTestId('password-input').type(faker.random.alphaNumeric(5));

  cy.getByTestId('submit').click();

  cy.getByTestId('loading-spinner').should('not.exist');
  cy.getByTestId('main-error').should('contain.text', 'Credenciais inválidas');

  cy.url().should('equal', `${baseUrl}/login`);
}

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

  it('should present a valid state if form is valid', () => {
    cy.getByTestId('email-input').type(faker.internet.email());
    cy.getByTestId('email-status')
      .should('have.attr', 'title', 'Tudo certo!')
      .should('contain.text', '🟢');

    cy.getByTestId('password-input').type(faker.random.alphaNumeric(5));
    cy.getByTestId('password-status')
      .should('have.attr', 'title', 'Tudo certo!')
      .should('contain.text', '🟢');

    cy.getByTestId('submit').should('not.have.attr', 'disabled');
    cy.getByTestId('error-wrapper').should('not.have.descendants');
  });

  describe('using mocked API responses', () => {
    it('should present an InvalidCredentialsError on response of status 401', () => {
      testInvalidCredentialsOnStatus401(true);
    });

    it('should present an UnexpectedError on response of status 400', () => {
      cy.intercept('POST', /login/, {
        statusCode: 400,
        body: {
          error: faker.random.words(),
        },
      });

      cy.getByTestId('email-input').type(faker.internet.email());
      cy.getByTestId('password-input').type(faker.random.alphaNumeric(5));

      cy.getByTestId('submit').click();

      cy.getByTestId('loading-spinner').should('not.exist');
      cy.getByTestId('main-error').should(
        'contain.text',
        'Parece que algo de errado aconteceu. Tente novamente em breve.'
      );

      cy.url().should('equal', `${baseUrl}/login`);
    });

    it('should present an UnexpectedError if an invalid property has been returned by the api', () => {
      cy.intercept('POST', /login/, {
        statusCode: 200,
        body: {
          invalidProperty: faker.random.words(),
        },
      });

      cy.getByTestId('email-input').type(faker.internet.email());
      cy.getByTestId('password-input').type(faker.random.alphaNumeric(5));

      cy.getByTestId('submit').click();

      cy.getByTestId('loading-spinner').should('not.exist');
      cy.getByTestId('main-error').should(
        'contain.text',
        'Parece que algo de errado aconteceu. Tente novamente em breve.'
      );

      cy.url().should('equal', `${baseUrl}/login`);
    });

    it('should save accessToken and redirects to home page if valid credentials are provided', () => {
      cy.intercept('POST', /login/, {
        statusCode: 200,
        body: {
          accessToken: faker.random.uuid(),
        },
      });

      cy.getByTestId('email-input').type('mango@gmail.com');
      cy.getByTestId('password-input').type('12345');

      cy.getByTestId('submit').click();

      cy.getByTestId('main-error').should('not.exist');
      cy.getByTestId('loading-spinner').should('not.exist');

      cy.url().should('equal', `${baseUrl}/`);

      cy.window().then((window) => assert.isOk(window.localStorage.getItem('accessToken')));
    });
  });

  describe('connecting to the real API', () => {
    it('should present an InvalidCredentialsError on response of status 401', () => {
      testInvalidCredentialsOnStatus401(false);
    });
  });
});
