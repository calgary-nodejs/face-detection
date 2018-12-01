'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const fr = require('face-recognition');

exports.createPathIfNotExists = (pathToCreate) =>
  fs.mkdirAsync(pathToCreate, { recursive: true });

exports.drawRectangle = (file, { top, left, bottom, right }) => {
  file
    .stroke('#00FF00', 2)
    .fill('none')
    .drawRectangle(left, top, right, bottom)
};

exports.drawRectangleWithText = (file, { top, left, bottom, right }, text) => {
  const font = './fonts/roboto/Roboto-Light.ttf';
  const fontSize = 25;

  file
    .stroke('#00FF00', 2)
    .fill('none')
    .drawRectangle(left, top, right, bottom)
    .strokeWidth(1)
    .font(font, fontSize)
    .drawText(left, bottom + fontSize + 10, text)
};

const getExtension = (file) => path.extname(file).substr(1).toLowerCase();

const supportedImageTypes = [ 'jpg', 'png' ];

const isImageFile = (file) => supportedImageTypes.includes(getExtension(file));

exports.loadFacesFromPath = (faceImagesPath) =>
  fs.readdirAsync(faceImagesPath)
  .filter(isImageFile)
  .map(imageFile => {
    const filePath = path.join(faceImagesPath, imageFile);
    console.log(`> ... Loading image <= ${filePath}`);
    return fr.loadImage(filePath);
  })

exports.printValidationErrorMessage = () => console.log(`
> ... [!] To run recognizer you need to provide:
>           - 1 or more training images (e.g. bpitt:faces-to-train/bpitt )
>           - a path to image to recognize faces (e.g. photos/1.jpg )
>
>         in the following format:
>
>     name:path/to/faces [ name:path/to/more/faces ] path/to/image/to/recognize.jpg
>
>     EXAMPLE: bpitt:faces-to-train/bpitt gclooney:faces-to-train/gclooney photos/1.jpg
`);
