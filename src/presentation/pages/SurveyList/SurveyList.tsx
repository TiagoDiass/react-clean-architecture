import React from 'react';
import Styles from './SurveyList.styles.scss';
import { Header, Footer } from '@/presentation/components';

import ThumbsUpIcon from '@/presentation/assets/icon-thumb-up.png';
import ThumbsDownIcon from '@/presentation/assets/icon-thumb-down.png';

const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrapper}>
      <Header />

      <main className={Styles.contentWrapper}>
        <h2>Enquetes</h2>

        <ul>
          <li>
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
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </main>

      <Footer />
    </div>
  );
};

export default SurveyList;
