import ModelBase from "./modelBase";
import {resize, rgb2greyscale} from "../utils/imutils";

export default class AgeGenderDetector extends ModelBase {
  constructor() {
    super('https://s3.amazonaws.com/intenseye-workshop/age_gender2/model.json');
  }

  predict = async (img) => {
    // resize image to shape of 64 x 64
    const resized = resize(img, 64);
    // convert it to greyscale and reduce the num of channels to 1
    const greyscale = await rgb2greyscale(resized);
    const input = greyscale.reshape([1, 64, 64, 1]);
    const prediction = this.model.predict(input);
    // the data() function is an asynchronous function but if you wish to
    // just see the data without asynchronicity you can call dataSync()
    return prediction.data()
  }
}
