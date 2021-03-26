import React, { useEffect } from 'react';
import { LoadSurveyList } from '@/domain/usecases';
import Styles from './SurveyList.styles.scss';
import { Header, Footer } from '@/presentation/components';
import { SurveyItemEmpty } from './components';

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  useEffect(() => {
    async function load() {
      await loadSurveyList.loadAll();
    }

    load();
  }, []);

  return (
    <div className={Styles.surveyListWrapper}>
      <Header />

      <main className={Styles.contentWrapper}>
        <h2>Enquetes</h2>

        <ul data-testid='survey-list'>
          <SurveyItemEmpty />
        </ul>
      </main>

      <Footer />
    </div>
  );
};

export default SurveyList;
