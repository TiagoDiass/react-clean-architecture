import React from 'react';
import Styles from './SurveyItem.styles.scss';

import ThumbsUpIcon from '@/presentation/assets/icon-thumb-up.png';
import ThumbsDownIcon from '@/presentation/assets/icon-thumb-down.png';
import { SurveyModel } from '@/domain/models';

type Props = {
  survey: SurveyModel;
};

const SurveyItem: React.FC<Props> = ({ survey }) => {
  return (
    <li className={Styles.surveyItemWrapper}>
      <div className={Styles.surveyContent}>
        <div className={[Styles.iconWrapper, 1 == 1 ? Styles.green : Styles.red].join(' ')}>
          <img data-testid='survey-icon' src={ThumbsUpIcon} alt='Thumbs Up icon' />
        </div>

        <time>
          <span className={Styles.day} data-testid='survey-day'>
            {survey.date.getDate()}
          </span>
          <span className={Styles.month} data-testid='survey-month'>
            {survey.date.toLocaleString('pt-BR', { month: 'long' })}
          </span>
          <span className={Styles.year} data-testid='survey-year'>
            {survey.date.getFullYear()}
          </span>
        </time>

        <p data-testid='survey-question'>{survey.question}</p>
      </div>
      <footer>Ver Resultado</footer>
    </li>
  );
};

export default SurveyItem;
