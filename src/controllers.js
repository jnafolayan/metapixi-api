import multer from 'multer';
import ImageEncoder from './lib/ImageEncoder';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const encodeImage = [

  upload.single('image'),  
  async (req, res) => {
    
    try {

      const result = await ImageEncoder.encode({
        message: req.body.message,
        buffer: req.file.buffer
      });

      res.status(201).json({
        image: result
      });

    } catch (err) {

      res.status(err.statusCode || 500).json({
        message: err.message || err
      });

    }

  }

];