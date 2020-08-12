import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

import routes from './routes';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

createConnection()
  .then(() => app.listen(process.env.PORT ?? 3333))
  .catch(error => console.warn(error));
