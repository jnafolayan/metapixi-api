import multer from 'multer';
import crypto from 'crypto';

import { ENCRYPTION_ALGORITHM } from './constants';
import ImageEncoder from './lib/ImageEncoder';
import ImageDecoder from './lib/ImageDecoder';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadImage = upload.single('image');

export const encodeImage = [

  uploadImage,  
  async (req, res) => {

    try {

      const result = await ImageEncoder.encode({
        message: encryptText(req.body.message, req.body.secretKey),
        buffer: req.file.buffer,
        mimetype: req.file.mimetype
      });

      req.file = null;
      res.status(200).json({
        image: result
      });

    } catch (err) {

      console.log(err)
      res.status(err.statusCode || 500).json({
        statusCode: err.statusCode || 500,
        message: err.message || err
      });

    }

  }

];

export const decodeImage = [

  uploadImage,  
  async (req, res) => {
    
    try {

      const result = await ImageDecoder.decode({
        buffer: req.file.buffer
      });

      res.status(200).json({
        message: decryptText(result, req.body.secretKey)
      });

    } catch (err) {
      
      console.error(err);
      res.status(err.statusCode || 500).json({
        statusCode: err.statusCode || 500,
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
  try {
    const textBuffer = Buffer.from(text, 'hex');
    const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, Buffer.from(key));
    let decrypted = decipher.update(textBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    throw {
      statusCode: 400,
      message: 'Secret key is incorrect'
    };
  }
};