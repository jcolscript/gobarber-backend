import User from '../models/User';

class UserController {
  // async show(req, res) {}

  async store(req, res) {
    try {
      const userData = req.body;
      const isUserAccount = await User.findOne({
        where: { email: userData.email },
      });

      if (isUserAccount) {
        return res
          .status(400)
          .json({ status: 400, message: 'user alredy exists.' });
      }

      const { id, name, email, provider } = await User.create(userData);
      return res
        .status(201)
        .json({ status: 201, data: { id, name, email, provider } });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: 'internal server error' });
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
          return res
            .status(400)
            .json({ status: 400, message: 'user alredy exists.' });
        }
      }

      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res
          .status(401)
          .json({ status: 401, message: 'password does not match' });
      }

      const { id, name, provider } = await user.update(req.body);

      return res
        .status(200)
        .json({ status: 200, data: { id, name, email, provider } });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: 'internal server error' });
    }
  }
}

export default new UserController();
