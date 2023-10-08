import { Route, RouteChildrenProps, Switch } from 'react-router-dom';

import routes from './config/route';

export interface IApplictionProps {
  //
}

const Application: React.FunctionComponent<IApplictionProps> = (props) => {
  return (
    <Switch>
      {routes.map((route, index) => {
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
  );
};

export default Application;
