import { Footer, Logo } from '@/presentation/components';
import React from 'react';
import Styles from './SurveyList.styles.scss';

const SurveyList: React.FC = () => {
  return (
    <div className={Styles.surveyListWrapper}>
      <header className={Styles.headerWrapper}>
        <div className={Styles.headerContent}>
          <Logo />
          <div className={Styles.logoutWrapper}>
            <span>Olá, Tiago</span>
            <a href='#'>Sair</a>
          </div>
        </div>
      </header>

      <main className={Styles.contentWrapper}>
        <h2>Enquetes</h2>
        <ul>
          <li>
            <div className={Styles.surveyContent}>
              <time>
                <span className={Styles.day}>22</span>
                <span className={Styles.month}>Dezembro</span>
                <span className={Styles.year}>2021</span>
              </time>

              <p>Qual é o seu framework web favorito?</p>
            </div>
            <footer>Ver Resultado</footer>
          </li>

          <li>
            <div className={Styles.surveyContent}>
              <time>
                <span className={Styles.day}>22</span>
                <span className={Styles.month}>Dezembro</span>
                <span className={Styles.year}>2021</span>
              </time>

              <p>Qual é o seu framework web favorito?</p>
            </div>
            <footer>Ver Resultado</footer>
          </li>
          <li>
            <div className={Styles.surveyContent}>
              <time>
                <span className={Styles.day}>22</span>
                <span className={Styles.month}>Dezembro</span>
                <span className={Styles.year}>2021</span>
              </time>

              <p>Qual é o seu framework web favorito?</p>
            </div>
            <footer>Ver Resultado</footer>
          </li>

          <li>
            <div className={Styles.surveyContent}>
              <time>
                <span className={Styles.day}>22</span>
                <span className={Styles.month}>Dezembro</span>
                <span className={Styles.year}>2021</span>
              </time>

              <p>Qual é o seu framework web favorito?</p>
            </div>
            <footer>Ver Resultado</footer>
          </li>
          <li>
            <div className={Styles.surveyContent}>
              <time>
                <span className={Styles.day}>22</span>
                <span className={Styles.month}>Dezembro</span>
                <span className={Styles.year}>2021</span>
              </time>

              <p>Qual é o seu framework web favorito?</p>
            </div>
            <footer>Ver Resultado</footer>
          </li>
        </ul>
      </main>

      <Footer />
    </div>
  );
};

export default SurveyList;
