import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import User from '../models/user';
import mongoose from 'mongoose';

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

const create = (req: Request, res: Response, next: NextFunction) => {
  logging.info('Attempting to register new user');

  const { uid, name } = req.body;
  const fireToken = res.locals.fireToken;

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    uid,
    name,
  });

  return user
    .save()
    .then((newUser) => {
      logging.info(`User ${uid} created`);
      return res.status(200).json({
        user: newUser,
        fireToken,
      });
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  logging.info('Loggin in user');

  const { uid } = req.body;
  const fireToken = res.locals.fireToken;

  return User.findOne({ uid })
    .then((user) => {
      if (user) {
        logging.info(`User ${uid} found. Signing in...`);
        return res.status(200).json({
          user,
          fireToken,
        });
      } else {
        logging.info(`User ${uid} not found. Registering...`);
        return create(req, res, next);
      }
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

// Get user by id
const read = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.userId;

  return User.findById(_id)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          user,
        });
      } else {
        return res.status(404).json({
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

// Get all users
const readAll = (req: Request, res: Response, next: NextFunction) => {
  return User.find()
    .exec()
    .then((users) => {
      return res.status(200).json({
        count: users.length,
        users,
      });
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

const controller = {
  validate,
  create,
  login,
  read,
  readAll,
};

export default controller;
