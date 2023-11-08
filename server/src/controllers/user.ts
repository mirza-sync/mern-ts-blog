import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import User from '../models/user';

const validate = (req: Request, res: Response, next: NextFunction) => {
  logging.info('Token validated. Returning user...');

  const firebase = res.locals.firebase;

  return User.findOne({ uid: firebase.uid })
    .then((user) => {
      if (user) {
        return res.status(200).json({
          user,
        });
      } else {
        return res.status(401).json({
          message: 'User not found',
        });
      }
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

const create = (req: Request, res: Response, next: NextFunction) => {};

const login = (req: Request, res: Response, next: NextFunction) => {};

const read = (req: Request, res: Response, next: NextFunction) => {};

const readAll = (req: Request, res: Response, next: NextFunction) => {};

export default {
  validate,
  create,
  login,
  read,
  readAll,
};
