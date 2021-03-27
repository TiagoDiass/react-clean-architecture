import React from 'react';
import { render, screen } from '@testing-library/react';

import SurveyItem from './SurveyItem';
import { mockSurveyModel } from '@/domain/test';

describe('SurveyItem Component', () => {
  it('should render the component correctly', () => {
    const survey = mockSurveyModel();

    survey.didAnswer = true;
    survey.date = new Date('2021-03-27T00:00:00');

    render(<SurveyItem survey={survey} />);

    expect(screen.getByTestId('survey-icon')).toHaveProperty('alt', 'Thumbs Up icon');
    expect(screen.getByTestId('survey-question')).toHaveTextContent(survey.question);
    expect(screen.getByTestId('survey-day')).toHaveTextContent('27');
    expect(screen.getByTestId('survey-month')).toHaveTextContent('março');
    expect(screen.getByTestId('survey-year')).toHaveTextContent('2021');
  });
});
