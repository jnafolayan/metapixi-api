import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { encodeImage, decodeImage } from './controllers';

const app = express();

app.use(cors({ origin: 'https://jnafolayan.github.io' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/encode', encodeImage);
app.post('/decode', decodeImage);

app.use((err, req, res, next) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

export default app;