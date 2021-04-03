import React from 'react';
import Styles from './SurveyItem.styles.scss';

import ThumbsUpIcon from '@/presentation/assets/icon-thumb-up.png';
import ThumbsDownIcon from '@/presentation/assets/icon-thumb-down.png';
import { LoadSurveyList } from '@/domain/usecases';

type Props = {
  survey: LoadSurveyList.Model;
};

const SurveyItem: React.FC<Props> = ({ survey }) => {
  return (
    <li className={Styles.surveyItemWrapper}>
      <div className={Styles.surveyContent}>
        <div className={[Styles.iconWrapper, 1 == 1 ? Styles.green : Styles.red].join(' ')}>
          <img
            src={survey.didAnswer ? ThumbsUpIcon : ThumbsDownIcon}
            alt={survey.didAnswer ? 'Thumbs Up icon' : 'Thumbs Down icon'}
          />
        </div>

        <time>
          <span className={Styles.day} data-testid='survey-day'>
            {survey.date.getDate().toString().padStart(2, '0')}
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
