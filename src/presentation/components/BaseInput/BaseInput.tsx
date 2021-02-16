import React, { ChangeEvent, useContext } from 'react';
import Styles from './BaseInput.styles.scss';
import { FormContext } from '@/presentation/contexts';

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const BaseInput: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext);
  const error = state[`${props.name}Error`];

  // Event handlers
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  // Getters helpers
  const getStatus = (): string => '🔴';

  const getTitle = (): string => {
    return error;
  };

  const getTestId = () => `${props.name}-status`;

  return (
    <div className={Styles.inputWrapper}>
      <input data-testid={`${props.name}-input`} {...props} onChange={handleInputChange} />

      <span title={getTitle()} data-testid={getTestId()} className={Styles.status}>
        {getStatus()}
      </span>
    </div>
  );
};

export default BaseInput;
