import { useEffect, useReducer, useState } from 'react';
import { Route, RouteChildrenProps, Switch } from 'react-router-dom';

import AuthRoute from './components/AuthRoute';
import LoadingComponent from './components/LoadingComponent';
import logging from './config/logging';
import routes from './config/route';
import { initialUserState, UserContextProvider, userReducer } from './contexts/user';
import { validate } from './modules/auth';

const Application: React.FunctionComponent = () => {
  const [user, userDispatch] = useReducer(userReducer, initialUserState);
  const [loading, setLoading] = useState<boolean>(true);

  // Used for debugging
  const [authStage, setAuthStage] = useState('Cheking localStorage...');

  useEffect(() => {
    setTimeout(() => {
      checkCredentials();
    }, 1000);
  }, []);

  const checkCredentials = () => {
    setAuthStage('Checking credentials...');

    const fireToken = localStorage.getItem('fire_token');
    if (fireToken === null) {
      userDispatch({ type: 'logout', payload: initialUserState });
      setAuthStage('No credentials found.');
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      setAuthStage('Credentials found. Validating...');
      setTimeout(() => {
        setLoading(false);
      }, 1000);

      return validate(fireToken, (error, user) => {
        if (error) {
          logging.error(error);
          setAuthStage('User not valid. Logging out.');
          userDispatch({ type: 'logout', payload: initialUserState });
        } else if (user) {
          setAuthStage('User authenticated');
          userDispatch({ type: 'login', payload: { user, fire_token: fireToken } });
        }

        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
    }
  };

  const userContextValues = {
    userState: user,
    userDispatch,
  };

  if (loading) {
    return <LoadingComponent>{authStage}</LoadingComponent>;
  }

  return (
    <UserContextProvider value={userContextValues}>
      <Switch>
        {routes.map((route, index) => {
          if (route.auth) {
            <Route
              key={index}
              exact={route.exact}
              path={route.path}
              render={(routerProps: RouteChildrenProps<any>) => (
                <AuthRoute>
                  <route.component {...routerProps} />
                </AuthRoute>
              )}
            />;
          }

          return (
            <Route
              key={index}
              exact={route.exact}
              path={route.path}
              render={(routerProps: RouteChildrenProps<any>) => (
                <route.component {...routerProps} />
              )}
            />
          );
        })}
      </Switch>
    </UserContextProvider>
  );
};

export default Application;
