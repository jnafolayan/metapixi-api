import Jimp from 'jimp';

import { BYTES_LENGTH } from '../constants';

export default class ImageDecoder {

  static async decode({ buffer }) {

    const image = await Jimp.read(buffer);
    const imageData = image.bitmap.data;

    let LSB = BYTES_LENGTH - 1;
    let imageCursor = 0;
    let binaryBuffer = '';

    for (; imageCursor < BYTES_LENGTH; imageCursor++) {
      const channel = imageData[imageCursor];
      const channelBytes = channel.toString(2).padStart(BYTES_LENGTH, '0');
      const byte = channelBytes.charAt(LSB);
      binaryBuffer += byte;
    }

    let characterCount = parseInt(binaryBuffer, 2);
    const characters = [];
    binaryBuffer = '';

    while (characters.length < characterCount) {    
      const channel = imageData[imageCursor];
      const channelBytes = channel.toString(2).padStart(BYTES_LENGTH, '0');
      const byte = channelBytes.charAt(LSB);
      binaryBuffer += byte;

      if (binaryBuffer.length == BYTES_LENGTH) {
        const code = parseInt(binaryBuffer, 2);
        characters.push(String.fromCharCode(code));
        binaryBuffer = '';
      }

      if (++imageCursor == imageData.length) {
    console.log('len', characterCount)
        imageCursor = 0;
        LSB -= 1;

        if (LSB == -1)
          break;
      }
    }

    return characters.join('');

  }

}
