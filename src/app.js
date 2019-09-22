import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { encodeImage, decodeImage } from './controllers';

const app = express();

app.options(cors());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/encode', encodeImage);
app.post('/decode', decodeImage);

app.use((err, req, res, next) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

export default app;