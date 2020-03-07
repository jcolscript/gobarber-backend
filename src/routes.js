import { Router } from 'express';
import multer from 'multer';

// Configs
import multerConfig from './config/multer';

// Controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderControle from './app/controllers/ProviderControle';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

// Middlewares
import auth from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

// User routes
routes.post('/users', UserController.store);
routes.put('/users', auth, UserController.update);

// Providers
routes.get('/providers', auth, ProviderControle.index);

// Appointments
routes.get('/appointments', auth, AppointmentController.index);
routes.post('/appointments', auth, AppointmentController.store);

// Schedules
routes.get('/schedules', auth, ScheduleController.index);

// Files
routes.post('/files', auth, upload.single('file'), FileController.store);

export default routes;
