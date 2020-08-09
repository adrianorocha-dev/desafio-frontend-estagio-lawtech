import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import SingUp from './pages/SingUp';
import DocumentsList from './pages/DocumentsList';
import ViewDocument from './pages/ViewDocument';
import PrivateRoute from './components/PrivateRoute';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute exact path="/" component={DocumentsList} />
        <PrivateRoute path="/document/:id" component={ViewDocument} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SingUp} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
