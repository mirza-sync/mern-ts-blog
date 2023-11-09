import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import firebaseAdmin from 'firebase-admin';

// Connect to firebase admin
let serviceAccountKey = require('./config/serviceAccountKey.json');

const app = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountKey),
});

const extractFirebaseInfo = (req: Request, res: Response, next: NextFunction) => {
  logging.info('Validating firebase token...');

  // The authorization string contains "Bearer <token_value>"
  // We're gonna retrieve the token_value
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    app
      .auth()
      .verifyIdToken(token)
      .then((result) => {
        if (result) {
          res.locals.firebase = result;
          res.locals.fireToken = token;
          next();
        } else {
          logging.warn('Token invalid. Unauthorized...');
          res.status(401).json({
            message: 'Unauthorized',
          });
        }
      })
      .catch((error) => {
        logging.error(error);
        res.status(401).json({
          error,
          message: 'Unauthorized',
        });
      });
  } else {
    logging.warn('No token in bearer. Unauthorized.');
    res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

export default extractFirebaseInfo;
