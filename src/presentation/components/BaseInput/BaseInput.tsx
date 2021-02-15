import React from 'react';
import Styles from './BaseInput.styles.scss';

const BaseInput: React.FC = () => {
  return (
    <div className={Styles.inputWrapper}>
      <input type='email' name='email' placeholder='Digite seu e-mail' />
      <span className={Styles.status}>🔴</span>
    </div>
  );
};

export default BaseInput;
