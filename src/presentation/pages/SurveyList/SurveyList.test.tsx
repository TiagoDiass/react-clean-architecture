import { render, screen } from '@testing-library/react';
import React from 'react';
import SurveyList from './SurveyList';

const makeSut = () => {
  render(<SurveyList />);
};

describe('SurveyList Component', () => {
  it('should present 4 empty SurveyListItems on the initial state', () => {
    makeSut();
    const surveyList = screen.getByTestId('survey-list');
    expect(surveyList.querySelectorAll('li:empty')).toHaveLength(4);
  });
});
