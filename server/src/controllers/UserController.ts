import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import bcrypt from 'bcrypt';

import { User } from '../entity/User';

import generateToken from '../utils/generateToken';

export default class UserController {
  async create(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      const connection = getConnection();
      const userRepository = connection.getRepository(User);

      if (await userRepository.findOne({ where: { email } })) {
        return response.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepository.create({ email, password: hashedPassword });

      const { id } = await userRepository.save(user);

      const token = generateToken({ id });

      return response.status(201).json({ token });
    } catch (error) {
      console.warn(error);
      return response
        .status(400)
        .json({ error: 'Unexpected error while creating user' });
    }
  }

  async detail(request: Request, response: Response) {
    const { email, password } = request.body;

    const connection = getConnection();
    const userRepository = connection.getRepository(User);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return response.status(400).json({ error: 'User not found' });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return response.status(400).json({ error: 'Invalid password' });
    }

    const token = generateToken({ id: user.id });

    response.json({ token });
  }
}
