import React, { useContext } from 'react';
import Styles from './BaseInput.styles.scss';
import { FormContext } from '@/presentation/contexts';

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const BaseInput: React.FC<Props> = (props: Props) => {
  const { errorState } = useContext(FormContext);
  const error = errorState[props.name];

  const getStatus = (): string => '🔴';

  const getTitle = (): string => {
    return error;
  };

  const getTestId = () => `${props.name}-status`;

  return (
    <div className={Styles.inputWrapper}>
      <input {...props} />

      <span title={getTitle()} data-testid={getTestId()} className={Styles.status}>
        {getStatus()}
      </span>
    </div>
  );
};

export default BaseInput;
