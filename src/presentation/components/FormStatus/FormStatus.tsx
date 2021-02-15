import React, { useContext } from 'react';
import Styles from './FormStatus.styles.scss';
import { Spinner } from '..';
import { FormContext as Context } from '@/presentation/contexts';

const FormStatus: React.FC = () => {
  const { isLoading, errorMessage } = useContext(Context);

  return (
    <div data-testid='error-wrapper' className={Styles.errorWrapper}>
      {isLoading && <Spinner className={Styles.spinner} />}
      {errorMessage && <span className={Styles.error}>{errorMessage}</span>}
    </div>
  );
};

export default FormStatus;
