const fs = require('fs');

const path = require('path');
const brain = require('brain.js');


const getData = () => {
  let data = fs.readFileSync('data.json');
  return JSON.parse(data);
};

const saveData = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data));
};

// log entry to the data log file
const appendToDataLog = (logEntry, dataLogFilePath) => {
  let dataLog = [];
  try {
      dataLog = JSON.parse(fs.readFileSync(dataLogFilePath));
  } catch (error) {
      // if file doesn't exist or is empty
  }
  dataLog.push(logEntry);
  fs.writeFileSync(dataLogFilePath, JSON.stringify(dataLog, null, 2));
};


// function to get image URLs from a folder
function getImageUrlsFromFolder(folderName) {
  const directoryPath = path.join(__dirname, 'public', 'images', folderName);
  try {
    const imageFiles = fs.readdirSync(directoryPath);
    return imageFiles.map(file => `/images/${folderName}/${file}`);
  } catch (error) {
    console.error("Error reading directory:", error);
    return [];
  }
}

// function to randomly select an image from an array
function getRandomImage(imageArray) {
  const randomIndex = Math.floor(Math.random() * imageArray.length);
  return imageArray[randomIndex];
}

// predict mood
const predictMood = (input) => {
  return network.run(input);
};

// initialize and train the neural network
const network = new brain.NeuralNetwork();
const trainingData = [
  { input: { healthy: 1, empty: 0, reveal: 0, bad: 0 }, output: { mood: 0.8 } },
  { input: { healthy: 0, empty: 0, reveal: 0, bad: 0 }, output: { mood: 0.0 } },
  { input: { healthy: 0, empty: 0, reveal: 1, bad: 0 }, output: { mood: 0.5 } },
  { input: { healthy: 0, empty: 0, reveal: 0, bad: 1 }, output: { mood: 0.2 } },
];
network.train(trainingData);

module.exports = { getImageUrlsFromFolder, predictMood, appendToDataLog, getData, saveData, getRandomImage };