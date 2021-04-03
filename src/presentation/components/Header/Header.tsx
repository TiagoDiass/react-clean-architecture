import React, { memo, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Styles from './Header.styles.scss';
import { Logo } from '@/presentation/components';
import { ApiContext } from '@/presentation/contexts';

const Header: React.FC = () => {
  const { setCurrentAccount, getCurrentAccount } = useContext(ApiContext);
  const history = useHistory();

  const logout = (event: React.MouseEvent) => {
    event.preventDefault();
    setCurrentAccount(null);
    history.replace('/login');
  };

  return (
    <header className={Styles.headerWrapper}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrapper}>
          <span data-testid='current-account-name'>Olá, {getCurrentAccount().name}</span>
          <a data-testid='logout' href='#' onClick={logout}>
            Sair
          </a>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
