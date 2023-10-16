import { signInWithPopup, UserCredential } from 'firebase/auth';

import { auth, Providers } from '../config/firebase';

export const signInWithSocialMedia = () => {
  new Promise<UserCredential>((resolve, reject) => {
    signInWithPopup(auth, Providers.google)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};
