import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore } from 'date-fns';

import Appointment from '../models/Appointments';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'validation fails' });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ message: 'you can only create appointments with providers' });
    }

    /**
     * Check for past date
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ message: 'past date are not permitted' });
    }

    /**
     * Check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        date: hourStart,
        canceled_at: null,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ message: 'appointment date is not available' });
    }

    const appointment = await Appointment.create({
      provider_id,
      user_id: req.userId,
      date: hourStart,
    });

    return res.status(201).json(appointment);
  }
}

export default new AppointmentController();
