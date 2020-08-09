import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute: React.FC<RouteProps> = ({
  component: Component,
  ...rest
}) => {
  const auth = useAuth();

  function isAuthenticated() {
    return auth.user !== undefined;
  }

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <>{Component && <Component {...props} />}</>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
