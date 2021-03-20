import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SurveyList } from '@/presentation/pages';

type Props = {
  makeLogin: React.FC;
  makeSignUp: React.FC;
};

const Router: React.FC<Props> = ({ makeLogin, makeSignUp }) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/signup' exact component={makeSignUp} />
        <Route path='/login' exact component={makeLogin} />
        <Route path='/' exact component={SurveyList} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
