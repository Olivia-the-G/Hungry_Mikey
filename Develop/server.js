const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const Sequelize = require('./config/connection');
const brain = require('brain');
const mysql = require('mysql2');
const router = ('express').Router();


const hbs = exphbs.create({});
const app = express();
const PORT = process.env.PORT || 3001;

const getData = () => {
  let data = fs.readFileSync('data.json');
  return JSON.parse(data);
};

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




// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// handlebars middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(require('./controllers/'));

const sequelize = require('./config/connection');

// // Set up Sequelize with your MySQL database
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

// ^ This is done in the connection.js file already

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

// // Configure express-session middleware
// app.use(session({
//   secret: `${user_password}`, //user's password input goes here
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: 'auto' }
// }));

// Authentication route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // logic to validate the user against the database

  // Simulate user authentication
  if(username === "testUser" && password === "testPassword") {
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect('/dashboard');
  } else {
    res.send('Incorrect Username and/or Password!');
  }  
});

// Dashboard route - Protected
router.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.send(`${randomMickeyGreetingAudio}`); // need to set up var for pulling random audio rec greeting
  } else {
    res.send('Please login to view this page!');
  }
  res.end();
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.send("You've been logged out");
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set up server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});