import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default (request: Request, response: Response, next: NextFunction) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'No auth token provided' });
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2) {
    return response.status(401).json({ error: 'Token error' });
  }

  const [scheme, token] = tokenParts;

  if (!/^Bearer$/i.test(scheme)) {
    return response.status(401).json({ error: 'Token malformatted' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return response.status(401).json({ error: 'Invalid token' });
    }

    //@ts-ignore
    request.userId = decoded.id;

    return next();
  });
};
