import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

type Props = {
  makeLogin: React.FC;
};

// Pages
import { Login } from '@/presentation/pages';

const Router: React.FC<Props> = ({ makeLogin }) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' exact component={makeLogin} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
