import React from 'react';
import Styles from './Spinner.styles.scss';

type Props = React.HTMLAttributes<HTMLElement>;

const Spinner: React.FC<Props> = (props) => {
  return (
    <div className={[Styles.spinner, props.className].join(' ')} data-testid='loading-spinner'>
      <div />
      <div />
      <div />
      <div />
    </div>
  );
};

export default Spinner;
