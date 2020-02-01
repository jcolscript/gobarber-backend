import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      cellphone: Yup.string()
        .required()
        .matches(
          /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:(([2-9])\d{3})?(\d{4}))(?:|[0-9])$/
        ),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'validations fails' });
    }

    try {
      const userData = req.body;
      const isUserAccount = await User.findOne({
        where: { email: userData.email },
      });

      if (isUserAccount) {
        return res.status(400).json({
          message: 'user alredy exists.',
        });
      }

      const { id, name, email, cellphone, provider } = await User.create(
        userData
      );
      return res.status(201).json({
        id,
        name,
        email,
        cellphone,
        provider,
      });
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      cellphone: Yup.string().matches(
        /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:(([2-9])\d{3})?(\d{4}))(?:|[0-9])$/
      ),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, fild) =>
          oldPassword ? fild.required() : fild
        ),
      confirmPassword: Yup.string().when('password', (password, fild) =>
        password ? fild.required().oneOf([Yup.ref('password')]) : fild
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'validations fails' });
    }

    const { email, oldPassword } = req.body;

    try {
      const user = await User.findByPk(req.userId);

      if (email && email !== user.email) {
        const isUserAccount = await User.findOne({
          where: { email },
        });

        if (isUserAccount) {
          return res.status(400).json({ message: 'user alredy exists.' });
        }
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ message: 'password does not match' });
      }

      const { id, name, cellphone, provider } = await user.update(req.body);

      return res.status(200).json({ id, name, email, cellphone, provider });
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }
}

export default new UserController();
