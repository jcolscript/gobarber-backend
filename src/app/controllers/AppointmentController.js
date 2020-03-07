import * as Yup from 'yup';

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

    // Check if provider_id is a provider

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ message: 'you can only create appointments with providers' });
    }

    const appointment = await Appointment.create({
      provider_id,
      user_id: req.userId,
      date,
    });

    return res.status(201).json(appointment);
  }
}

export default new AppointmentController();
