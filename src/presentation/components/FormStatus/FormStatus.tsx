import React, { useContext } from 'react';
import Styles from './FormStatus.styles.scss';
import { Spinner } from '..';
import { FormContext as Context } from '@/presentation/contexts';

const FormStatus: React.FC = () => {
  const { state, errorState } = useContext(Context);
  const { isLoading } = state;
  const { main } = errorState;

  return (
    <div data-testid='error-wrapper' className={Styles.errorWrapper}>
      {isLoading && <Spinner className={Styles.spinner} />}
      {main && <span className={Styles.error}>{main}</span>}
    </div>
  );
};

export default FormStatus;
