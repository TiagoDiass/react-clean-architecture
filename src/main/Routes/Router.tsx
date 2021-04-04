import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ApiContext } from '@/presentation/contexts';
import {
  setCurrentAccountAdapter,
  getCurrentAccountAdapter,
} from '@/main/adapters/current-account-adapter';
import { PrivateRoute } from '@/presentation/components';

import { makeLogin, makeSignUp, makeSurveyList } from '../factories/pages';

const Router: React.FC = () => {
  return (
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter,
      }}
    >
      <BrowserRouter>
        <Switch>
          <Route path='/signup' exact component={makeSignUp} />
          <Route path='/login' exact component={makeLogin} />
          <PrivateRoute path='/' exact component={makeSurveyList} />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  );
};

export default Router;
