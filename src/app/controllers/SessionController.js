import jwt from 'jsonwebtoken';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ status: 401, message: 'user not found' });
      }

      if (!(await user.checkPassword(password))) {
        return res
          .status(401)
          .json({ status: 401, message: 'password does not match' });
      }

      const { id, name } = user;

      return res.status(200).json({
        status: 200,
        data: {
          id,
          name,
          email,
          token: jwt.sign({ id }, '3ac58480903f4ea53b1a48f6d23f3e15', {
            expiresIn: '7d',
          }),
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: 'internal server error' });
    }
  }
}

export default new SessionController();
