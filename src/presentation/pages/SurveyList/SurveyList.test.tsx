import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SurveyList from './SurveyList';
import { LoadSurveyList } from '@/domain/usecases';
import { mockSurveyListModel } from '@/domain/test';
import { UnexpectedError } from '@/domain/errors';

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0;
  surveys = mockSurveyListModel();

  async loadAll() {
    this.callsCount++;

    return this.surveys;
  }
}

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()) => {
  render(<SurveyList loadSurveyList={loadSurveyListSpy} />);

  return { loadSurveyListSpy };
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

  it('should render an error on failure', async () => {
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
});
