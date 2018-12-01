'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const { createPathIfNotExists, loadFacesFromPath } = require('./utils');

exports.train = (recognizer, personName, faceImagesPath) =>
  loadFacesFromPath(faceImagesPath)
  .then(faces => {
    recognizer.addFaces(faces, personName)
    return faces;
  })
  .catch(err => console.log(`> ... Failed training images from ${faceImagesPath}`));

exports.trainPairsConcurrently = (recognizer, trainingPairs) =>
      Promise
      .map(trainingPairs, pair => pair.split(':'))
      .map(([ personName, faceImagesPath ]) => {
        if (!personName || !faceImagesPath) { return; }
        console.log(`> ... Training faces of ${personName}`);
        return this.train(recognizer, personName, faceImagesPath);
      });

exports.saveState = async (recognizer, saveToFilePath) => {
  await createPathIfNotExists(path.dirname(saveToFilePath));
  const recognizerState = JSON.stringify(recognizer.serialize());
  await fs.writeFileAsync(saveToFilePath, recognizerState);
};

exports.recognizeFaces = (faceRecognizer, facesToRecognize) =>
  Promise
  .each(facesToRecognize, async (face) => {
    const prediction = await faceRecognizer.predictBest(face);
    const { className, distance } = prediction;
    console.log(`> ... Recognized ${className} (${distance})`);
  })
  .catch(err => console.log('> ... Predicting failed: ', err));

exports.predictFaces = async (faceRecognizer, facesToRecognize) => {
  try {
    const predictedNames = await facesToRecognize.map(async (face) => {
      const prediction = await faceRecognizer.predictBest(face);
      const { className, distance } = prediction;
      console.log(`> ... Recognized ${className} (${distance})`);
      return prediction;
    });
    return await predictedNames;

  } catch(err) {
    console.log('> ... Predicting failed: ', err);
  }
}
