const express = require('express');
const fs = require('fs');
const path = require('path');
const brain = require('brain.js');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const getData = () => {
  let data = fs.readFileSync('data.json');
  return JSON.parse(data);
};

const saveData = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data));
};

// Initialize and train the neural network
const network = new brain.NeuralNetwork();
const trainingData = [
  { input: { healthy: 1, empty: 0, reveal: 0, bad: 0 }, output: { mood: 0.8 } },
  { input: { healthy: 0, empty: 1, reveal: 0, bad: 0 }, output: { mood: 0.3 } },
  { input: { healthy: 0, empty: 0, reveal: 1, bad: 0 }, output: { mood: 0.5 } },
  { input: { healthy: 0, empty: 0, reveal: 0, bad: 1 }, output: { mood: 0.2 } },
];
network.train(trainingData);

// Endpoint to get Tamagotchi status
app.get('/status', (req, res) => {
  const data = getData();
  res.json(data);
});

// Function to predict mood
const predictMood = (input) => {
  return network.run(input);
};

// Endpoint to feed the Tamagotchi
app.post('/feed', (req, res) => {
  let data = getData();
  data.foodLevel = (data.foodLevel || 0) + 1;

  let input = {
    healthy: req.body.feedType === 'feedHealthy' ? 1 : 0,
    empty: req.body.feedType === 'feedEmpty' ? 1 : 0,
    reveal: req.body.feedType === 'feedReveal' ? 1 : 0,
    bad: req.body.feedType === 'feedBad' ? 1 : 0,
  };

  data.mood = predictMood(input).mood;
  saveData(data);
  res.json({ message: 'Tamagotchi has been fed!', foodLevel: data.foodLevel, mood: data.mood });
});


function postFeedAction(feedType) {
    $.post('/feed', { feedType: feedType }, function(data) {
        console.log(data);
        fetchStatus();
        startAnimation();
        updateTamagotchiMood(data.mood); // Update Tamagotchi's mood visually
    }, 'json');
}

// Endpoint to feed empty
app.post('/feedEmpty', (req, res) => {
  let data = getData();

  if (data.foodLevel > 0) {
    data.foodLevel -= 1;

    let input = { healthy: 0, empty: 1, reveal: 0, bad: 0 };
    data.mood = predictMood(input).mood;

    saveData(data);
    res.json({ message: 'Tamagotchi has been fed empty!', foodLevel: data.foodLevel, mood: data.mood });
  } else {
    res.status(400).json({ message: 'Tamagotchi is already empty!' });
  }
});

// Endpoint to feed reveal
app.post('/feedReveal', (req, res) => {
  let data = getData();

  let input = { healthy: 0, empty: 0, reveal: 1, bad: 0 };
  data.mood = predictMood(input).mood;

  saveData(data);
  res.json({ message: 'Tamagotchi has been fed with a reveal!', mood: data.mood });
});

app.post('/decreaseFood', (req, res) => {
    let data = getData();

    // Decrease food level by 10, but not below 0
    data.foodLevel = Math.max(0, (data.foodLevel || 0) - 10);

    // Define the input for mood prediction based on the decreaseFood action
    // This is an example; you need to adjust it based on your mood prediction logic
    let input = { healthy: 0, empty: data.foodLevel === 0 ? 1 : 0, reveal: 0, bad: 0 };

    // Update the mood based on the new input
    data.mood = predictMood(input).mood;

    saveData(data);
    res.json({ message: 'Food level decreased!', foodLevel: data.foodLevel, mood: data.mood });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
