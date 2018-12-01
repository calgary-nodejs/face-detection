'use strict';

const path = require('path');
const Promise = require('bluebird');
const fr = require('face-recognition');
const { recognizeFaces, saveState, trainPairsConcurrently, predictFaces, recognizeFaces2 } = require('./common/recognizer');
const { detectFaces } = require('./common/detector');
const { printValidationErrorMessage, createPathIfNotExists, drawRectangleWithText } = require('./common/utils');
const gm = require('gm');

const resultsPath = path.resolve(`${__dirname}/../faces-recognized`);

const main = async (trainingPairs, imageToRecognizeFaces) => {
  try {
    const faceRecognizer = fr.AsyncFaceRecognizer()

    const faces = await trainPairsConcurrently(faceRecognizer, trainingPairs);
    console.log('> ... Recognizer trained');

    const filename = new Date().getTime() + '.json';
    const saveToFilePath = path.join(`${__dirname}/../recognizer-state`, filename)
    await saveState(faceRecognizer, saveToFilePath);
    console.log(`> ... Recognizer state saved to => ${saveToFilePath}`);

    console.log('> ... Detecting faces from => ', imageToRecognizeFaces);
    const faceDetector = fr.AsyncFaceDetector();
    const facesDetected = await detectFaces(faceDetector, imageToRecognizeFaces);
    const predictedFacePromises = await predictFaces(faceRecognizer, facesDetected);
    const predictedFaces = await Promise.all(predictedFacePromises);
    drawPredictedFaces(faceDetector, imageToRecognizeFaces, facesDetected, predictedFaces);
  } catch(err) {
    console.log('> ... Something went wrong', err);
  }
};

const drawPredictedFaces = (faceDetector, file, rectangles, predictions) => {
  const image = fr.loadImage(file);

  createPathIfNotExists(resultsPath)
    .then(() => faceDetector.locateFaces(image))
    .then(rectangles => {
      drawRectanglesWithPredictions(rectangles, predictions, file)
    })
    .catch(err => console.log(err));
}

const drawRectanglesWithPredictions = (rectangles, names, file) => {
  const gmFile = gm(file);
  const fileName = path.basename(file);

  console.log(`> ... Detected ${rectangles.length} face(s) in the image ${file}`);
  try {
    rectangles.forEach(({ rect }, i) => {
      const name = `${names[i].className} - ${names[i].distance}`;
      drawRectangleWithText(gmFile, rect, name);
    });
  } catch (err) {
    console.log('Error Drawing rectangles', err);
    throw err;
  }
  const saveToFile = path.join(resultsPath, fileName);
  gmFile.write(saveToFile, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`> ... Marked face rectangles saved in ${saveToFile}`);
  });
}

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
