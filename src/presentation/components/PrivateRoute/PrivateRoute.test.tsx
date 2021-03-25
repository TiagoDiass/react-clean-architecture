import React from 'react';
import PrivateRoute from './PrivateRoute';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';

type SutTypes = {
  history: MemoryHistory;
};

const makeSut = (): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  render(
    <Router history={history}>
      <PrivateRoute />
    </Router>
  );

  return { history };
};

describe('PrivateRoute Component', () => {
  it('should redirect to /login if an empty token is provided', () => {
    const { history } = makeSut();

    expect(history.location.pathname).toBe('/login');
  });
});
