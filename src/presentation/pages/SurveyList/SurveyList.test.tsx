import { LoadSurveyList } from '@/domain/usecases';
import { render, screen } from '@testing-library/react';
import React from 'react';
import SurveyList from './SurveyList';

class LoadSurveyListSpy implements LoadSurveyList {
  callsCount = 0;

  async loadAll() {
    this.callsCount++;

    return null;
  }
}

const makeSut = () => {
  const loadSurveyListSpy = new LoadSurveyListSpy();
  render(<SurveyList loadSurveyList={loadSurveyListSpy} />);

  return { loadSurveyListSpy };
};

describe('SurveyList Component', () => {
  it('should present 4 empty SurveyListItems on the initial state', () => {
    makeSut();
    const surveyList = screen.getByTestId('survey-list');
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4);
  });

  it('should call LoadSurveyList when page renders', () => {
    const { loadSurveyListSpy } = makeSut();
    expect(loadSurveyListSpy.callsCount).toBe(1);
  });
});
