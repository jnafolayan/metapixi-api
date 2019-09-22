import multer from 'multer';
import crypto from 'crypto';

import { ENCRYPTION_ALGORITHM } from './constants';
import ImageEncoder from './lib/ImageEncoder';
import ImageDecoder from './lib/ImageDecoder';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const encodeImage = [

  upload.single('image'),  
  async (req, res) => {
    
    try {

      const result = await ImageEncoder.encode({
        message: encryptText(req.body.message, req.body.secretKey),
        buffer: req.file.buffer
      });

      res.status(200).json({
        image: result
      });

    } catch (err) {

      res.status(err.statusCode || 500).json({
        message: err.message || err
      });

    }

  }

];

export const decodeImage = [

  upload.single('image'),  
  async (req, res) => {
    
    try {

      const result = await ImageDecoder.decode({
        buffer: req.file.buffer
      });

      res.status(200).json({
        message: decryptText(result, req.body.secretKey)
      });

    } catch (err) {

      console.log(err);

      res.status(err.statusCode || 500).json({
        message: err.message || err
      });

    }

  }

];

const encryptText = (text, key) => {
  const cipher = crypto.createCipher(ENCRYPTION_ALGORITHM, Buffer.from(key));
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
};

const decryptText = (text, key) => {
  const textBuffer = Buffer.from(text, 'hex');
  const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, Buffer.from(key));
  let decrypted = decipher.update(textBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};