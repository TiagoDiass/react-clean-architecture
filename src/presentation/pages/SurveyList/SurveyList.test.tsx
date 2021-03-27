import { mockSurveyListModel } from '@/domain/test';
import { LoadSurveyList } from '@/domain/usecases';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import SurveyList from './SurveyList';

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0;
  surveys = mockSurveyListModel();

  async loadAll() {
    this.callsCount++;

    return this.surveys;
  }
}

const makeSut = () => {
  const loadSurveyListSpy = new LoadSurveyListSpy();
  render(<SurveyList loadSurveyList={loadSurveyListSpy} />);

  return { loadSurveyListSpy };
};

describe('SurveyList Component', () => {
  it('should present 4 empty SurveyListItems on the initial state', async () => {
    makeSut();
    const surveyList = screen.getByTestId('survey-list');
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4);
    await waitFor(() => surveyList);
  });

  it('should call LoadSurveyList when page renders', async () => {
    const { loadSurveyListSpy } = makeSut();
    expect(loadSurveyListSpy.callsCount).toBe(1);
    await waitFor(() => screen.getByRole('heading'));
  });

  it('should render SurveyItems on success', async () => {
    makeSut();
    const surveyList = await screen.findByTestId('survey-list');
    expect(surveyList.querySelectorAll('li.surveyItemWrapper')).toHaveLength(3);
  });
});
