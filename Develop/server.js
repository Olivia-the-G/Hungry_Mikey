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
// express middleware for serving static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));
// function to read and parse game data from a JSON file

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handlebars middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// include routes from controllers
app.use(routes);
const getData = () => {
  let data = fs.readFileSync('data.json');
  return JSON.parse(data);
};

// Explicit routes for Mikey frames
app.get('/images/Mikey_Frames/Mikey_Frame_1.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'images', 'Mikey_Frames', 'Mikey_Frame_1.svg'));
});

app.get('/images/Mikey_Frames/Mikey_Frame_2.svg', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'images', 'Mikey_Frames', 'Mikey_Frame_2.svg'));
});


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

// New route in server.js to fetch specific Mikey frame image URL
// app.get('/getMikeyFrameImageUrl/:frameNumber', (req, res) => {
//     const frameNumber = req.params.frameNumber;
//     const imagePath = `/images/Mikey_Frames/Mikey_Frame_${frameNumber}.svg`;
//     res.json({ url: imagePath });
// });


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
// app.use(express.static(path.join(__dirname, 'public')));

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


// endpoint to feed healthy
app.post('/feedHealthy', (req, res) => {
    let data = getData();
    data.foodLevel = (data.foodLevel || 0) + 5;
    data.size = (data.size || 0) + 1;

    let input = { healthy: 1, empty: 0, reveal: 0, bad: 0 };
    data.mood = predictMood(input).mood;

    saveData(data);

    const logEntry = {
        action: 'feedHealthy',
        response: 'Tamagotchi is happy and well-fed!',
        moodChange: data.mood - (data.mood - 1),
        timestamp: new Date().toISOString(),
    };
    appendToDataLog(logEntry, 'dataFeedLog.json');

    let responseMessages = {
        highMood: "Tamagotchi is happy and well-fed!",
        mediumMood: "Tamagotchi is feeling okay after the meal.",
        lowMood: "Tamagotchi is not very happy with that food."
    };

    let responseMessage = '';

    if (data.mood >= 0.6) {
        responseMessage = responseMessages.highMood;
    } else if (data.mood >= 0.3) {
        responseMessage = responseMessages.mediumMood;
    } else {
        responseMessage = responseMessages.lowMood;
    }

    res.json({ message: responseMessage, foodLevel: data.foodLevel, size: data.size, mood: data.mood });
});


// endpoint to feed empty
app.post('/feedEmpty', (req, res) => {
    let data = getData();

    // check if the Tamagotchi has any food level left
    if (data.foodLevel > 0) {
        // Decrement food level by 1
        data.foodLevel -= 1;

        // input mood prediction is constant for this feed type
        data.mood = predictMood({ healthy: 0, empty: 1, reveal: 0, bad: 0 }).mood;

        const logEntry = {
            action: 'feedEmpty',
            response: 'Tamagotchi is fed empty.',
            moodChange: data.mood - predictMood({ healthy: 0, empty: 1, reveal: 0, bad: 0 }).mood // Calculate mood change
        };
        appendToDataLog(logEntry, 'dataFeedLog.json');

        saveData(data);

        res.json({ message: 'Tamagotchi has been fed empty!', foodLevel: data.foodLevel, mood: data.mood });
    } else {
        // if food level is already at 0, send a success response with no further action
        res.json({ message: 'Tamagotchi has no food left!', foodLevel: data.foodLevel, mood: data.mood });
    }
});


// endpoint to feed reveal
app.post('/feedReveal', (req, res) => {
    let data = getData();
    data.size = (data.size || 0);

    let input = { healthy: 0, empty: 0, reveal: 1, bad: 0 };
    data.mood = predictMood(input).mood;

    const logEntry = {
        action: 'feedReveal',
        response: 'Tamagotchi is fed with a reveal.',
        moodChange: data.mood - predictMood(input).mood // calculate mood change
    };
    appendToDataLog(logEntry, 'dataFeedLog.json');

    saveData(data);

    res.json({ message: 'Tamagotchi has been fed with a reveal!', size: data.size, mood: data.mood });
});



// endpoint to feed bad
app.post('/feedBad', (req, res) => {
    let data = getData();

    // update food level and size
    data.foodLevel = Math.max(0, (data.foodLevel || 0) - 10);
    data.size = Math.max(0, (data.size || 0) - 10); // Ensuring size doesn't go negative

    // input mood prediction is constant for this feed type
    let moodPrediction = predictMood({ healthy: 0, empty: 0, reveal: 0, bad: 1 });

    // generate a response message based on the mood prediction
    let responseMessage = '';
    if (moodPrediction.mood >= 0.8) {
        responseMessage = 'Tamagotchi is upset after a bad meal!';
    } else if (moodPrediction.mood >= 0.6) {
        responseMessage = 'Tamagotchi is not happy about the bad meal.';
    } else if (moodPrediction.mood >= 0.4) {
        responseMessage = 'Tamagotchi is disappointed with the bad meal.';
    } else {
        responseMessage = 'Tamagotchi is very unhappy after a bad meal.';
    }

    data.mood = moodPrediction.mood;

    const logEntry = {
        action: 'feedBad',
        response: responseMessage,
        moodChange: data.mood - moodPrediction.mood
    };
    appendToDataLog(logEntry, 'dataFeedLog.json');

    saveData(data);

    res.json({ message: responseMessage, foodLevel: data.foodLevel, size: data.size, mood: data.mood });
});

// handlebar routes for returning to game
app.get('/game', (req, res) => {
    res.render('game', { title: 'Hungry Mikey' });
});

// handlebars routes for parental control page
app.get('/parental-control', (req, res) => {
    res.render('parentalControl', { title: 'Parental Control Switch' });
});


// express middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// handlebars middleware
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');

// include routes from controllers
// app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
