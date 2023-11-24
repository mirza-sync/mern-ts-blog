import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import Blog from '../models/blog';
import mongoose from 'mongoose';
import IBlog from '../interfaces/blog.';

const create = (req: Request, res: Response, next: NextFunction) => {
  logging.info('Attempting to register new blog');

  const { author, title, content, headline, picture } = req.body as IBlog;

  const blog = new Blog({
    _id: new mongoose.Types.ObjectId(),
    author,
    title,
    content,
    headline,
    picture,
  });

  return blog
    .save()
    .then((newBlog) => {
      logging.info(`New blog created`);
      return res.status(200).json({
        blog: newBlog,
      });
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

// Get blog by id
const read = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.blogId;

  return Blog.findById(_id)
    .then((blog) => {
      if (blog) {
        return res.status(200).json({
          blog,
        });
      } else {
        return res.status(404).json({
          message: 'Blog not found',
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

// Get all blogs
const query = (req: Request, res: Response, next: NextFunction) => {
  logging.info('Querying blogs...');

  return Blog.find(req.body)
    .exec()
    .then((blogs) => {
      return res.status(200).json({
        count: blogs.length,
        blogs,
      });
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

const update = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.blogId;
  logging.info(`Updating blog ${_id}...`);

  return Blog.findById(_id)
    .exec()
    .then((blog) => {
      if (blog) {
        blog.set(req.body);

        blog
          .save()
          .then((blog) => {
            logging.info(`Blog updated`);
            return res.status(200).json({
              blog,
            });
          })
          .catch((error) => {
            logging.error(error);
            return res.status(500).json({
              error,
            });
          });
      } else {
        return res.status(404).json({ message: `Blog ${_id} not found` });
      }
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

const deleteBlog = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.blogId;
  logging.warn(`Incoming delete for blog ${_id}`);

  return Blog.findByIdAndDelete(_id)
    .then(() => {
      return res.status(200).json({
        message: 'Blog deleted',
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
  create,
  read,
  query,
  update,
  deleteBlog,
};

export default controller;
