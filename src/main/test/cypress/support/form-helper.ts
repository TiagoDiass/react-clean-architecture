const baseUrl: string = Cypress.config().baseUrl;

type VerifyInputStatusParams = {
  fieldName: string;
  error?: string;
  inputStatus: 'initial' | 'valid' | 'invalid';
};

/**
 * @helper verifica o status de um input (wrapper do input, o próprio input, a label e small também caso o inputStatus seja invalid)
 */
export const verifyInputStatus = ({
  fieldName,
  error = '',
  inputStatus,
}: VerifyInputStatusParams): void => {
  cy.getByTestId(`${fieldName}-wrapper`).should('have.attr', 'data-status', inputStatus);

  if (inputStatus == 'invalid') {
    cy.getByTestId(`${fieldName}-input`).should('have.attr', 'title', error);
    cy.getByTestId(`${fieldName}-label`).should('have.attr', 'title', error);
    cy.getByTestId(`${fieldName}-small`).should('contain.text', error);
  } else if (inputStatus === 'valid') {
    cy.getByTestId(`${fieldName}-input`).should('not.have.attr', 'title');
    cy.getByTestId(`${fieldName}-label`).should('not.have.attr', 'title');
    cy.getByTestId(`${fieldName}-small`).should('not.exist');
  }
};

/**
 * @helper verifica se o spinner não existe e se o main-error contém o error passado como parâmetro
 */
export const verifyMainError = (error: string) => {
  cy.getByTestId('loading-spinner').should('not.exist');
  cy.getByTestId('main-error').should('contain.text', error);
};

/**
 * @helper verifica a url atual
 */
export const verifyCurrentUrl = (path: string) => {
  cy.url().should('equal', `${baseUrl}${path}`);
};
