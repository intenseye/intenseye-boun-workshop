import * as faceapi from 'face-api.js'
import ModelBase from "./modelBase";

export default class FaceDetector extends ModelBase  {
  constructor() {
    super('https://s3.amazonaws.com/intenseye-workshop/face_detector');
  }

  loadModel = () => {
    return faceapi.nets.tinyFaceDetector.load(this.modelPath)
  };

  detectFace = input => {
    return faceapi
      .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
      .then(dets => faceapi.extractFaces(input, dets))
  }

}
