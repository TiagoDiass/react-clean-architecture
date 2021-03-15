import React, { ChangeEvent, useContext, useRef } from 'react';
import Styles from './BaseInput.styles.scss';
import { FormContext } from '@/presentation/contexts';

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const BaseInput: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext);
  const error = state[`${props.name}Error`];
  const inputRef = useRef<HTMLInputElement>();

  // Event handlers
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className={Styles.inputWrapper}>
      <input
        data-testid={`${props.name}-input`}
        {...props}
        placeholder=' '
        onChange={handleInputChange}
        ref={inputRef}
      />

      <label onClick={() => inputRef.current.focus()}>{props.placeholder}</label>

      <span
        title={error || 'Tudo certo!'}
        data-testid={`${props.name}-status`}
        className={Styles.status}
      >
        {error ? '🔴' : '🟢'}
      </span>
    </div>
  );
};

export default BaseInput;
