import User from '../models/User';

class UserController {
  async store(req, res) {
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
