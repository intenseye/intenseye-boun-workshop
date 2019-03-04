import * as tf from "@tensorflow/tfjs";

export default class ModelBase {
  constructor(modelPath) {
    this.modelPath = modelPath;
  }
  loadModel = () => tf.loadLayersModel(this.modelPath)
    .then((model) => {
      this.model = model;
      console.log(`Loaded model with shape: ${model.input.shape}`)
    })
    .catch(console.log);
}
