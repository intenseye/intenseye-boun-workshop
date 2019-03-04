import ModelBase from './modelBase';
import {resize, rgb2greyscale} from '../utils/imutils';

export default class EmotionDetector extends ModelBase {
  constructor() {
    super('https://s3.amazonaws.com/intenseye-workshop/emotion/model.json')
  }
  emotions = {
    0: 'Angry',
    1: 'Disgusted',
    2: 'Fearful',
    3: 'Happy',
    4: 'Sad',
    5: 'Surprised',
    6: 'Neutral',
  };

  predict = async (img) => {
    const resized = resize(img, 48);
    const grayscale_image = await rgb2greyscale(resized);
    const input = grayscale_image.reshape([1, 48, 48, 1]);
    const prediction = this.model.predict(input);
    const values = await prediction.data();
    const result = [];
    values.forEach((value, index) => result.push({ label: this.emotions[index], value }));
    return result
  }
}
