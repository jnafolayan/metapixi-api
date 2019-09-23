import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { encodeImage, decodeImage } from './controllers';

const app = express();

app.use(function(req, res, next) {
  if (process.env.NODE_ENV == 'development')
    res.header("Access-Control-Allow-Origin", "*");
  else 
    res.header("Access-Control-Allow-Origin", "https://jnafolayan.github.io");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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