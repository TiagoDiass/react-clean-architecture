import React, { ChangeEvent, useContext, useRef, useState } from 'react';
import Styles from './BaseInput.styles.scss';
import { FormContext } from '@/presentation/contexts';

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const BaseInput: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(FormContext);
  const error = state[`${props.name}Error`];
  const inputRef = useRef<HTMLInputElement>();
  const [focusCount, setFocusCount] = useState(0);

  // Event handlers
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const getInputStatus = () => (error ? 'invalid' : 'valid');
  const inputStatus = focusCount > 0 ? getInputStatus() : 'initial';

  return (
    <div
      data-testid={`${props.name}-wrapper`}
      data-status={inputStatus}
      className={Styles.inputWrapper}
    >
      <input
        {...props}
        data-testid={`${props.name}-input`}
        onChange={handleInputChange}
        onFocus={() => setFocusCount(focusCount + 1)}
        title={error}
        placeholder=' '
        ref={inputRef}
      />

      <label
        data-testid={`${props.name}-label`}
        onClick={() => inputRef.current.focus()}
        title={error}
      >
        {props.placeholder}
      </label>

      {error && focusCount > 0 && <small data-testid={`${props.name}-small`}>{error}</small>}
    </div>
  );
};

export default BaseInput;
