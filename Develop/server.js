const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const brain = require('brain.js');
const mysql = require('mysql2');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({});

// function to read and parse game data from a JSON file
const getData = () => {
  let data = fs.readFileSync('data.json');
  return JSON.parse(data);
};

// function to write data to a JSON file
const saveData = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data));
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

// retrieve all logged data
const getAllDataLogEntries = (dataLogFilePath) => {
  try {
      return JSON.parse(fs.readFileSync(dataLogFilePath));
  } catch (error) {
      return [];
  }
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

// express middleware for serving static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// get random image URLs for each button type
app.get('/getImageUrls', (req, res) => {
  const healthyImages = getImageUrlsFromFolder('HealthyFood');
  const emptyImages = getImageUrlsFromFolder('EmptyFood');
  const badImages = getImageUrlsFromFolder('BadFood');
  const revealImages = getImageUrlsFromFolder('RevealFood');

  res.json({
    healthy: getRandomImage(healthyImages),
    empty: getRandomImage(emptyImages),
    bad: getRandomImage(badImages),
    reveal: getRandomImage(revealImages)
  });
});

// retrieve all logged data
app.get('/getAllLoggedData', (req, res) => {
    const loggedData = getAllDataLogEntries('dataFeedLog.json');
    res.json(loggedData);
});

// get Tamagotchi status
app.get('/status', (req, res) => {
  const data = getData();
  res.json(data);
});

// predict mood
const predictMood = (input) => {
  return network.run(input);
};


function postFeedAction(feedType) {
    $.post('/feed', { feedType: feedType }, function(data) {
        console.log(data);
        fetchStatus();
        startAnimation();
        updateTamagotchiMood(data.mood);
    }, 'json');
}



// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handlebars middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// include routes from controllers
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
