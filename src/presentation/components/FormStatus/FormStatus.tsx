import React, { useContext } from 'react';
import Styles from './FormStatus.styles.scss';
import { Spinner } from '..';
import { FormContext as Context } from '@/presentation/contexts';

const FormStatus: React.FC = () => {
  const { state } = useContext(Context);
  const { isLoading, mainError } = state;

  return (
    <div data-testid='error-wrapper' className={Styles.errorWrapper}>
      {isLoading && <Spinner className={Styles.spinner} />}
      {mainError && (
        <span data-testid='main-error' className={Styles.error}>
          {mainError}
        </span>
      )}
    </div>
  );
};

export default FormStatus;
