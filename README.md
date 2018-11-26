# Fece Detection & Recognition

This is a sample app that demonstrates how to do face detection and recognition

## Requirements
To be able to install the npm packages listed in the `package.json` dependencies you need to install the following first:
- cmake
- libx11 or XQuartz for the dlib GUI
- libpng for reading images
- GraphicsMagick to draw face rectangles

### MacOS / OSX
- `brew install cmake`
- `brew cask install xquartz`
- `brew install libpng`
- `brew install graphicsmagick`
### Linux
- `sudo apt-get install libx11-dev`
- `sudo apt-get install libpng-dev`
### Windows
- cmake
- VS2017 build tools (not Visual Studio 2017) -> https://www.visualstudio.com/de/downloads/

## Install
After you installed the above requirements you can do:
```shell
> yarn install

// or with npm

> npm install
```
This might take some time to do the autobuild and install the packages.

## How to use

### Detecting faces
For detecting faces and drawing rectangles you can do:

```
> yarn faces:detect path/to/picture/with-faces.jpg

// or with npm using sample pictures included in /photos folder

> npm run faces:detect photos/1.jpg
```
The image with rectangles of the detected faces will be saved in `./faces-detected` with the same filename.

### Recognizing faces
To train the recognizer model with faces and recognize faces on a provided picture you can do:

```
> yarn faces:recognize name:path/to/faces [ name:path/to/more/faces ] path/to/image/to/recognize.jpg

```
To train the model with people to recognize, each training pair argument `name:/path/to/faces` contains person's name _(before `:` colon)_ and path to the folder containing the face images _(after the `:` colon)_. For example, to use some sample faces included in `./faces-to-train` you can use a training pair `bpitt:faces-to-train/bpitt`. You can supply 1 or more training pairs.
```
// or with npm using training pictures incuded in /faces-to-train folder
// and a sample picture included in /photos folder

> npm run faces:recognize gclooney:faces-to-train/gclooney bpitt:faces-to-train/bpitt photos/2.jpg
```
The above command will also save the trained recognizer model state in the folder `./recognizer-state` with the unix timestamp as a filename.

### Sample pictures to use
There are some sample pictures included here:
- Face images _(150x150 pixels)_ extrated and saved in `./faces-to-train`. These can be used to train the recognizer.
- Images with multiple people in `./photos` folder. These pictures can be used to test the prediction accuracy of the recognizer that's trained with face images above.

## Coding challenge
As an enhancement implement a new feature that allows to draw rectangles of the recognized people on the provided picture with lables under the rectangles showing the name of the person with best matching prediciton. The image with rendered face rectangles and lables shoud be saved in a folder `./faces-recognized`

To use this feature a user should be able to issue a command:

```
> yarn faces:recognize:locate name:path/to/faces [ name:path/to/more/faces ] path/to/image/to/recognize.jpg
```
Where the last argument is the picture to recognize faces with one or more training pairs. While implementing the above feature try to refactor and reuse the included code in `./src/commons` if possible.
