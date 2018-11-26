'use strict';

const fr = require('face-recognition');

exports.detectFaces = async (faceDetector, imageToDetectFaces) => {
  const image = fr.loadImage(imageToDetectFaces);
  const facesDetected = await faceDetector.detectFaces(image);
  console.log(`> ... Detected ${facesDetected.length} face(s)`);
  return facesDetected;
};
