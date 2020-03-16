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
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

// Validators
import Validators from './app/validators';

// Middlewares
import auth from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', Validators.sessionStore, SessionController.store);

// User routes
routes.post('/users', Validators.userStore, UserController.store);
routes.put('/users', auth, Validators.userUpdate, UserController.update);

// Providers
routes.get('/providers', auth, ProviderControle.index);
routes.get('/providers/:providerId/available', auth, AvailableController.index);

// Appointments
routes.get('/appointments', auth, AppointmentController.index);
routes.post(
  '/appointments',
  auth,
  Validators.appointmentStore,
  AppointmentController.store
);
routes.delete('/appointments/:id', auth, AppointmentController.delete);

// Schedules
routes.get('/schedules', auth, ScheduleController.index);

// Notifications
routes.get('/notifications', auth, NotificationController.index);
routes.put('/notifications/:id', auth, NotificationController.update);

// Files
routes.post('/files', auth, upload.single('file'), FileController.store);

export default routes;
