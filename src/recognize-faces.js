'use strict';

const path = require('path');
const Promise = require('bluebird');
const fr = require('face-recognition');
const { recognizeFaces, saveState, trainPairsConcurrently } = require('./common/recognizer');
const { detectFaces } = require('./common/detector');
const { printValidationErrorMessage } = require('./common/utils');

const main = async (trainingPairs, imageToRecognizeFaces) => {
  try {
    const faceRecognizer = fr.AsyncFaceRecognizer()

    const faces = await trainPairsConcurrently(faceRecognizer, trainingPairs);
    console.log('> ... Recognizer trained');

    const filename = new Date().getTime() + '.json';
    const saveToFilePath = path.join(`${__dirname}/../recognizer-state`, filename)
    await saveState(faceRecognizer, saveToFilePath);
    console.log(`> ... Recognizer state saved to => ${saveToFilePath}`);

    const faceDetector = fr.AsyncFaceDetector();
    const facesDetected = await detectFaces(faceDetector, imageToRecognizeFaces);
    recognizeFaces(faceRecognizer, facesDetected);
  } catch(err) {
    console.log('> ... Something went wrong');
  }
};

const validateArgs = (args) => {
  if (args.length < 2) {
    printValidationErrorMessage();
    return false;
  }
  return true;
}

const [ _, __, ...args ] = process.argv;

if(!validateArgs(args)) {
  return;
}

const [ imageToRecognizeFaces ] = args.slice(-1);
const trainingPairs = args.slice(0, -1);

main(trainingPairs, imageToRecognizeFaces);
