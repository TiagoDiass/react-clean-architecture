import React, { useEffect, useState } from 'react';
import { LoadSurveyList } from '@/domain/usecases';
import Styles from './SurveyList.styles.scss';
import { Header, Footer } from '@/presentation/components';
import { SurveyItem, SurveyItemEmpty } from './components';
import { SurveyModel } from '@/domain/models';

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  const [surveys, setSurveys] = useState<SurveyModel[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((surveys) => setSurveys(surveys))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div className={Styles.surveyListWrapper}>
      <Header />

      <main className={Styles.contentWrapper}>
        <h2>Enquetes</h2>

        {error ? (
          <div>
            <span data-testid='error'>{error}</span>
            <button>Recarregar</button>
          </div>
        ) : (
          <ul data-testid='survey-list'>
            {surveys.length ? (
              surveys.map((survey) => <SurveyItem key={survey.id} survey={survey} />)
            ) : (
              <SurveyItemEmpty />
            )}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SurveyList;
