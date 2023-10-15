import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

import config from './config';

const firebaseApp = initializeApp(config.firebase);

export const Providers = {
  google: new GoogleAuthProvider(),
};
export const auth = getAuth(firebaseApp);

export default firebaseApp;
