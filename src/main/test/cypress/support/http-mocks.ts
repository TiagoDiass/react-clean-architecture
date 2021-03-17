import faker from 'faker';

type MockUnexpectedErrorParams = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: RegExp;
};

export const mockUnexpectedError = ({ method, url }: MockUnexpectedErrorParams) => {
  cy.intercept(method, url, {
    statusCode: faker.helpers.randomize([400, 404, 500]),
    body: {
      error: faker.random.words(),
    },
  });
};
