import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import logging from '../../config/logging';
import UserContext from '../../contexts/user';

const AuthRoute: React.FunctionComponent = (props) => {
  const { user } = useContext(UserContext).userState;

  if (user._id === 'null') {
    logging.info('Unauthorized. Redirecting...');
    return <Redirect to="/login" />;
  } else {
    return <>{props.children}</>;
  }
};

export default AuthRoute;
