import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import SurveyList from './SurveyList';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { LoadSurveyListSpy, mockAccountModel } from '@/domain/test';
import { ApiContext } from '@/presentation/contexts';

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()) => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const setCurrentAccountMock = jest.fn();
  render(
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountMock,
        getCurrentAccount: () => mockAccountModel(),
      }}
    >
      <Router history={history}>
        <SurveyList loadSurveyList={loadSurveyListSpy} />)
      </Router>
    </ApiContext.Provider>
  );

  return { loadSurveyListSpy, history, setCurrentAccountMock };
};

describe('SurveyList Component', () => {
  it('should present 4 empty SurveyListItems on the initial state', async () => {
    makeSut();
    const surveyList = screen.getByTestId('survey-list');
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    await waitFor(() => surveyList);
  });

  it('should call LoadSurveyList when page renders', async () => {
    const { loadSurveyListSpy } = makeSut();
    expect(loadSurveyListSpy.callsCount).toBe(1);
    await waitFor(() => screen.getByRole('heading', { name: /Enquetes/ }));
  });

  it('should render SurveyItems on success', async () => {
    makeSut();
    const surveyList = await screen.findByTestId('survey-list');
    expect(surveyList.querySelectorAll('li.surveyItemWrapper')).toHaveLength(3);
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  it('should render an error on UnexpectedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    const error = new UnexpectedError();
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error);

    makeSut(loadSurveyListSpy);
    await waitFor(() => screen.getByRole('heading', { name: /Enquetes/ }));

    const surveyList = screen.queryByTestId('survey-list');
    expect(surveyList).not.toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent(error.message);
  });

  it('should rerender when click on reload after failure', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    const error = new UnexpectedError();
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(error);

    makeSut(loadSurveyListSpy);
    await waitFor(() => screen.getByRole('heading', { name: /Enquetes/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    await waitFor(() => screen.getByRole('heading', { name: /Enquetes/ }));
    expect(loadSurveyListSpy.callsCount).toBe(1);
  });

  it('should logout on AccessDeniedError', async () => {
    const loadSurveyListSpy = new LoadSurveyListSpy();
    jest.spyOn(loadSurveyListSpy, 'loadAll').mockRejectedValueOnce(new AccessDeniedError());

    const { history, setCurrentAccountMock } = makeSut(loadSurveyListSpy);
    await waitFor(() => screen.getByRole('heading', { name: /Enquetes/ }));
    expect(setCurrentAccountMock).toHaveBeenCalledWith(null);
    expect(history.location.pathname).toBe('/login');
  });
});
