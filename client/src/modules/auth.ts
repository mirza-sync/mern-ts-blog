import { AuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';

import { auth } from '../config/firebase';

export const signInWithSocialMedia = (provider: AuthProvider) => {
  return new Promise<UserCredential>((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};
