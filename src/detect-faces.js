'use strict';

const gm = require('gm');
const path = require('path');
const fr = require('face-recognition');
const { createPathIfNotExists, drawRectangle } = require('./common/utils');

const file = process.argv[2];

const image = fr.loadImage(file);

const faceDetector = fr.AsyncFaceDetector();

const resultsPath = path.resolve(`${__dirname}/../faces-detected`);

createPathIfNotExists(resultsPath)
  .then(() => faceDetector.locateFaces(image))
  .then(rectangles => {
    const gmFile = gm(file);
    const fileName = path.basename(file);
    console.log(`> ... Detected ${rectangles.length} face(s) in the image ${file}`);
    rectangles.forEach(({ rect }) => drawRectangle(gmFile, rect));
    const saveToFile = path.join(resultsPath, fileName);
    gmFile.write(saveToFile, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`> ... Marked face rectangles saved in ${saveToFile}`);
    });
  })
  .catch(err => console.log(err));
