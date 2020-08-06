import jwt from 'jsonwebtoken';

export default function generateToken(params: any) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: 86400,
  });
}
