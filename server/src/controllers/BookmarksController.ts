import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';
import { Document } from '../entity/Document';
import { Bookmark } from '../entity/Bookmark';

interface AuthenticatedRequest extends Request {
  userId: number;
}

export default class BookmarksController {
  async create(request: AuthenticatedRequest, response: Response) {
    const { documentId, pageNumber, text } = request.body;

    const connection = getConnection();
    const userRepository = connection.getRepository(User);
    const documentRepository = connection.getRepository(Document);
    const bookmarkRepository = connection.getRepository(Bookmark);

    try {
      const user = await userRepository.findOne(request.userId);

      if (!user) {
        return response.status(401).json({ error: 'User not authenticated' });
      }

      const document = await documentRepository.findOne(documentId);

      if (!document) {
        return response.status(404).json({ error: 'Document not found' });
      }

      const bookmark = await bookmarkRepository.save(
        bookmarkRepository.create({
          document,
          pageNumber,
          text,
        })
      );

      return response.status(201).send({ id: bookmark.id });
    } catch (error) {
      console.error(error);
      return response.status(400).send();
    }
  }

  async delete(request: AuthenticatedRequest, response: Response) {
    const { id } = request.params;

    const connection = getConnection();
    const userRepository = connection.getRepository(User);
    const bookmarkRepository = connection.getRepository(Bookmark);

    try {
      const user = await userRepository.findOne(request.userId);

      if (!user) {
        return response.status(401).json({ error: 'User not authenticated' });
      }

      await bookmarkRepository.delete(id);

      return response.status(200).send();
    } catch (error) {
      console.error(error);
      return response.status(400).send();
    }
  }
}
