// tap trung vaof express, ddinhj nghia middleware (cors, json parser) gan vao routes

import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import errorHandler from './middleware/errorMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//middlewares
app.use(cors());  //cho phep cress-origin
app.use(express.json()); //doc body json


app.use(express.urlencoded({ extended: true }));// cho phep doc được thông tin từ url


app.get('/', (req, res) => {
  res.json({ message: 'ChatWeb API is running' });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//gan tat car route vaof /api
app.use('/api', routes);

app.use(errorHandler);

export default app;
