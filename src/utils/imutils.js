import * as tf from '@tensorflow/tfjs'

export const resize = (img, size) => {
  // convert image to tensor
  const tensor = tf.browser.fromPixels(img);
  const [height, width] = tensor.shape;

  if (height === size && width === size) {
    return tensor
  }
  // resize the image and with alignCorners parameter set to true
  return tf.image.resizeBilinear(tensor, [size, size], true)
};

export const rgb2greyscale = async tensor => {
  const minT = tensor.min();
  const maxT = tensor.max();
  const data = await Promise.all([minT.data(), maxT.data()]);
  const [min, max] = data.map(d => d[0]);
  minT.dispose();
  maxT.dispose();
  // Convert the elements from [0, 255] -> [0, 1]
  const normalized = tensor.sub(tf.scalar(min)).div(tf.scalar(max - min))

  // get mean of r, g, b values
  const grayscale = normalized.mean(2);

  // expand the dimensions to keep the shape as (h, w, 1)
  return grayscale.expandDims(2)
};
