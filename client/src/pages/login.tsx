import { AuthProvider } from 'firebase/auth';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';

import CenterPiece from '../components/CenterPiece';
import LoadingComponent from '../components/LoadingComponent';
import TextMessage from '../components/TextMessage';
import { Providers } from '../config/firebase';
import logging from '../config/logging';
import UserContext from '../contexts/user';
import { authenticate, signInWithSocialMedia as socialMediaPopup } from '../modules/auth';

const LoginPage = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');
  const userContext = useContext(UserContext);
  const history = useHistory();
  const isLogin = window.location.pathname.includes('login');

  const signInWithSocialMedia = (provider: AuthProvider) => {
    if (authError !== '') setAuthError('');
    setAuthenticating(true);
    socialMediaPopup(provider)
      .then(async (result) => {
        logging.info(result);
        const user = result.user;
        if (user) {
          const id = user.uid;
          const name = user.displayName;

          if (name) {
            try {
              const fireToken = await user.getIdToken();
              authenticate(id, name, fireToken, (error, _user) => {
                if (error) {
                  setAuthError(error);
                  setAuthenticating(false);
                } else if (_user) {
                  userContext.userDispatch({
                    type: 'login',
                    payload: { user: _user, fire_token: fireToken },
                  });
                  history.push('/');
                }
              });
            } catch (error) {
              setAuthError('Invalid token');
              logging.error(authError);
              setAuthenticating(false);
            }

            // If we get a token, authenticate with the backend
          } else {
            setAuthError('The identity provider doesnt have a name attribute');
            setAuthenticating(false);
          }
        } else {
          setAuthError(
            'The identity provider is missing some necessary information. Please try another account or provider',
          );
          setAuthenticating(false);
        }
      })
      .catch((err) => {
        setAuthError(err.message);
        setAuthenticating(false);
      });
  };

  return (
    <CenterPiece>
      <Card>
        <CardHeader>{isLogin ? 'Login' : 'Sign Up'}</CardHeader>
        <CardBody>
          <TextMessage type={'error'} message={authError} />
          <Button
            block
            disabled={authenticating}
            onClick={() => signInWithSocialMedia(Providers.google)}
            style={{
              backgroundColor: '#ea4335',
              borderColor: '#ea4335',
            }}
          >
            <i className="fab fa-google mr-2" />
            Sign {isLogin ? 'In' : 'Up'} with Google
          </Button>
          {authenticating && <LoadingComponent card={false} />}
        </CardBody>
      </Card>
    </CenterPiece>
  );
};

export default LoginPage;
