import { signInWithPopup, UserCredential } from 'firebase/auth';

import { auth, Providers } from '../config/firebase';

export const signInWithSocialMedia = (provider: typeof Providers) => {
  return new Promise<UserCredential>((resolve, reject) => {
    signInWithPopup(auth, provider.google)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};
