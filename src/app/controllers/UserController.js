import User from '../models/User';

class UserController {
  async show(req, res) {}

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
      return res.status(201).json({ id, name, email, provider });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: 'internal server error' });
    }
  }
}

export default new UserController();
