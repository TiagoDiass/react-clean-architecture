import React from 'react';
import { render, screen } from '@testing-library/react';

import SurveyItem from './SurveyItem';
import { mockSurveyModel } from '@/domain/test';
import { SurveyModel } from '@/domain/models';

type MakeSutParams = {
  survey: SurveyModel;
};

const makeSut = ({ survey = mockSurveyModel() }: MakeSutParams) => {
  render(<SurveyItem survey={survey} />);
};

describe('SurveyItem Component', () => {
  it('should render correctly', () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: true,
      date: new Date('2021-03-27T00:00:00'),
    });

    makeSut({ survey });

    expect(screen.getByTestId('survey-icon')).toHaveProperty('alt', 'Thumbs Up icon');
    expect(screen.getByTestId('survey-question')).toHaveTextContent(survey.question);
    expect(screen.getByTestId('survey-day')).toHaveTextContent('27');
    expect(screen.getByTestId('survey-month')).toHaveTextContent('março');
    expect(screen.getByTestId('survey-year')).toHaveTextContent('2021');
  });

  it('should render correctly with other date', () => {
    const survey = Object.assign(mockSurveyModel(), {
      didAnswer: false,
      date: new Date('2019-05-03T00:00:00'),
    });

    makeSut({ survey });

    expect(screen.getByTestId('survey-icon')).toHaveProperty('alt', 'Thumbs Down icon');
    expect(screen.getByTestId('survey-question')).toHaveTextContent(survey.question);
    expect(screen.getByTestId('survey-day')).toHaveTextContent('03');
    expect(screen.getByTestId('survey-month')).toHaveTextContent('maio');
    expect(screen.getByTestId('survey-year')).toHaveTextContent('2019');
  });
});
