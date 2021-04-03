import React from 'react';
import Header from './Header';
import { ApiContext } from '@/presentation/contexts';

import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const makeSut = () => {
  const setCurrentAccoutnMock = jest.fn();
  const history = createMemoryHistory({ initialEntries: ['/'] });
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccoutnMock }}>
      <Router history={history}>
        <Header />
      </Router>
    </ApiContext.Provider>
  );

  return {
    setCurrentAccoutnMock,
    history,
  };
};

describe('Header Component', () => {
  it('should call setCurrentAccount passing null as parameter(Logoff)', () => {
    const { history, setCurrentAccoutnMock } = makeSut();
    fireEvent.click(screen.getByTestId('logout'));
    expect(setCurrentAccoutnMock).toHaveBeenCalledWith(null);
    expect(history.location.pathname).toBe('/login');
  });
});
