import axios from 'axios';
import { AuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';

import config from '../config/config';
import { auth } from '../config/firebase';
import logging from '../config/logging';
import IUser from '../interfaces/user';

export const signInWithSocialMedia = (provider: AuthProvider) => {
  return new Promise<UserCredential>((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

export const authenticate = async (
  uid: string,
  name: string,
  fireToken: string,
  callback: (error: string | null, user: IUser | null) => void,
) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${config.server.url}/users/login`,
      headers: { Authorization: `Bearer ${fireToken}` },
      data: {
        uid,
        name,
      },
    });
    if (response.status === 200 || response.status === 201 || response.status === 304) {
      logging.info('Authentication successful');
      callback(null, response.data.user);
    } else {
      logging.warn('Unable to aunthenticate');
      callback('Unable to authenticate', null);
    }
  } catch (error) {
    logging.error(error);
    callback(`Something went wrong. ${error}`, null);
  }
};

export const validate = async (
  fireToken: string,
  callback: (error: string | null, user: IUser | null) => void,
) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${config.server.url}/users/validate`,
      headers: { Authorization: `Bearer ${fireToken}` },
    });
    if (response.status === 200 || response.status === 304) {
      logging.info('Token validation successful');
      callback(null, response.data.user);
    } else {
      logging.warn('Token invalid');
      callback('Unable to validate user', null);
    }
  } catch (error) {
    logging.error(error);
    callback(`Something went wrong. ${error}`, null);
  }
};
