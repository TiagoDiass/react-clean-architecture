import React, { memo } from 'react';
import Styles from './Header.styles.scss';
import { Logo } from '@/presentation/components';

const Header: React.FC = () => {
  return (
    <header className={Styles.headerWrapper}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrapper}>
          <span>Olá, Tiago</span>
          <a href='#'>Sair</a>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
