import { Router } from 'express';
import multer from 'multer';

// Configs
import multerConfig from './config/multer';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

// Middlewares
import auth from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

// User routes
routes.post('/users', UserController.store);
routes.put('/users', auth, UserController.update);

// Avatars
routes.post('/avatars', auth, upload.single('avatar'), (req, res) => {
  return res.json({ message: 'ok' });
});

export default routes;
