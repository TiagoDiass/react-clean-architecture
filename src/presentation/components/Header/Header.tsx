import React, { memo, useContext } from 'react';
import Styles from './Header.styles.scss';
import { Logo } from '@/presentation/components';
import { ApiContext } from '@/presentation/contexts';
import { useLogout } from '@/presentation/hooks';

const Header: React.FC = () => {
  const logout = useLogout();
  const { getCurrentAccount } = useContext(ApiContext);

  const handleLogoutClick = (event: React.MouseEvent) => {
    event.preventDefault();
    logout();
  };

  return (
    <header className={Styles.headerWrapper}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrapper}>
          <span data-testid='current-account-name'>Olá, {getCurrentAccount().name}</span>
          <a data-testid='logout' href='#' onClick={handleLogoutClick}>
            Sair
          </a>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
