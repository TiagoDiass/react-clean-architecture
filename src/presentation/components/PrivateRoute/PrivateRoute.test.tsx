import React from 'react';
import PrivateRoute from './PrivateRoute';
import { render } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';
import { ApiContext } from '@/presentation/contexts';
import { mockAccountModel } from '@/domain/test';

type SutTypes = {
  history: MemoryHistory;
};

const makeSut = ({ account = mockAccountModel() }): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] });

  render(
    <ApiContext.Provider value={{ getCurrentAccount: () => account }}>
      <Router history={history}>
        <PrivateRoute />
      </Router>
    </ApiContext.Provider>
  );

  return { history };
};

describe('PrivateRoute Component', () => {
  it('should redirect to /login if an empty token is provided', () => {
    const { history } = makeSut({ account: null });

    expect(history.location.pathname).toBe('/login');
  });

  it('should render the current component if a valid token is provided', () => {
    const { history } = makeSut({});

    expect(history.location.pathname).toBe('/');
  });
});
