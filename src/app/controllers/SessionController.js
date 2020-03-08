import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'validations fails' });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          message: 'user not found',
        });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({
          message: 'password does not match',
        });
      }

      const { id, name, cellphone } = user;

      return res.status(200).json({
        id,
        name,
        email,
        cellphone,
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      return res.status(500).json({
        message: 'internal server error',
      });
    }
  }
}

export default new SessionController();
