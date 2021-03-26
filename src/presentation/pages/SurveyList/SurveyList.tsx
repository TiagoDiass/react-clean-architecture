import React from 'react';
import Styles from './SurveyList.styles.scss';
import { Header, Footer } from '@/presentation/components';
import { SurveyItemEmpty } from './components';

const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrapper}>
      <Header />

      <main className={Styles.contentWrapper}>
        <h2>Enquetes</h2>

        <ul></ul>
      </main>

      <Footer />
    </div>
  );
};

export default SurveyList;
