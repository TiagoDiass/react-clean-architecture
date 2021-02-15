import React from 'react';
import Styles from './FormStatus.styles.scss';
import { Spinner } from '..';

const FormStatus: React.FC = () => {
  return (
    <div className={Styles.errorWrapper}>
      <Spinner className={Styles.spinner} />
      <span className={Styles.error}>Erro</span>
    </div>
  );
};

export default FormStatus;
