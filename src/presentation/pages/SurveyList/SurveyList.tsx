import React, { useEffect, useState } from 'react';
import { LoadSurveyList } from '@/domain/usecases';
import Styles from './SurveyList.styles.scss';
import { Header, Footer } from '@/presentation/components';
import { SurveyItem, SurveyListEmpty } from './components';
import { SurveyModel } from '@/domain/models';

type Props = {
  loadSurveyList: LoadSurveyList;
};

const SurveyList: React.FC<Props> = ({ loadSurveyList }) => {
  const [surveys, setSurveys] = useState<SurveyModel[]>([]);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(false);

  useEffect(() => {
    loadSurveyList
      .loadAll()
      .then((surveys) => setSurveys(surveys))
      .catch((error) => setError(error.message));
  }, [reload]);

  const handleReload = () => {
    setSurveys([]);
    setError('');
    setReload(!reload);
  };

  return (
    <div className={Styles.surveyListWrapper}>
      <Header />

      <main className={Styles.contentWrapper}>
        <h2>Enquetes</h2>

        {error ? (
          <div className={Styles.errorWrapper}>
            <span data-testid='error'>{error}</span>
            <button onClick={handleReload}>Tentar novamente</button>
          </div>
        ) : (
          <ul data-testid='survey-list'>
            {surveys.length ? (
              surveys.map((s) => <SurveyItem key={s.id} survey={s} />)
            ) : (
              <SurveyListEmpty />
            )}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SurveyList;
