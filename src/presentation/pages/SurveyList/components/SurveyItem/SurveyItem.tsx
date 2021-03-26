import React from 'react';
import Styles from './SurveyItem.styles.scss';

import ThumbsUpIcon from '@/presentation/assets/icon-thumb-up.png';
import ThumbsDownIcon from '@/presentation/assets/icon-thumb-down.png';

const SurveyItem: React.FC = () => {
  return (
    <li className={Styles.surveyItemWrapper}>
      <div className={Styles.surveyContent}>
        <div className={[Styles.iconWrapper, 1 == 1 ? Styles.green : Styles.red].join(' ')}>
          <img src={ThumbsUpIcon} alt='Thumbs Up icon' />
        </div>

        <time>
          <span className={Styles.day}>22</span>
          <span className={Styles.month}>Dezembro</span>
          <span className={Styles.year}>2021</span>
        </time>

        <p>Qual é o seu framework web favorito?</p>
      </div>
      <footer>Ver Resultado</footer>
    </li>
  );
};

export default SurveyItem;
