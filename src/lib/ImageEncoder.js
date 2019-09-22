import Jimp from 'jimp';

import { BYTES_LENGTH } from '../constants';

export default class ImageEncoder {

  static async encode({ message, buffer }) {

    const image = await Jimp.read(buffer);
    const imageData = image.bitmap.data;
  
    // convert message characters to their ASCII reps
    const codes = message.split('').map(char => char.charCodeAt(0));
    codes.unshift(codes.length);

    // convert codes to their binary equivalents
    const binaryCodes = codes.map(code => code.toString(2).padStart(BYTES_LENGTH, '0'));

    // least significant bit
    let LSB = BYTES_LENGTH - 1;
    let imageCursor = 0;

    while (binaryCodes.length) {
      const bytes = binaryCodes.shift();
      
      // grab each byte and push it into the imageData
      for (let byte of bytes) {
        const channel = imageData[imageCursor];
        const channelBytes = channel.toString(2).padStart(BYTES_LENGTH, '0');
        const newChannelValue = channelBytes.substring(0, LSB) 
          + byte 
          + channelBytes.substring(LSB + 1);
        imageData[imageCursor] = parseInt(newChannelValue, 2);
        imageCursor += 1;

        if (imageCursor == imageData.length) {
          imageCursor = 0;
          LSB -= 1;
          
          if (LSB == -1)
            break;
        }
      }
    }

    const base64 = await image.getBase64Async(Jimp.AUTO);

    return base64;

  }

}
