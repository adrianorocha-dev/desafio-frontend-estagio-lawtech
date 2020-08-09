import { Router } from 'express';
import { getConnection } from 'typeorm';
import jwt from 'jsonwebtoken';
import multer from 'multer';

import { User } from './entity/User';

import authMiddleware from './middlewares/auth';

import multerConfig from './config/multer';

import UserController from './controllers/UserController';
import DocumentsController from './controllers/DocumentsController';
import BookmarksController from './controllers/BookmarksController';

const routes = Router();

const upload = multer(multerConfig);

const userController = new UserController();
const documentsController = new DocumentsController();
const bookmarksController = new BookmarksController();

routes.post('/register', userController.create);
routes.post('/authenticate', userController.authenticate);

routes.get('/documents', authMiddleware, documentsController.index);
routes.get('/documents/:id', authMiddleware, documentsController.detail);
routes.post(
  '/documents',
  upload.single('document'),
  authMiddleware,
  documentsController.create
);

routes.post('/bookmarks', authMiddleware, bookmarksController.create);
routes.delete('/bookmarks/:id', authMiddleware, bookmarksController.delete);

export default routes;
