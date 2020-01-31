import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ status: 401, message: 'token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(
      token,
      '3ac58480903f4ea53b1a48f6d23f3e15'
    );

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(401).json({ status: 401, message: 'token invalid' });
  }
};
