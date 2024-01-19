const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// Serves static files (JS and cvs images) from the same directory as index.html
app.use(express.static(path.join(__dirname, 'public')));

// Read data from a JSON file
const getData = () => {
  let data = fs.readFileSync('data.json');
  return JSON.parse(data);
};

// Write data to a JSON file
const saveData = (data) => {
  fs.writeFileSync('data.json', JSON.stringify(data));
};

// Endpoint to get Tamagotchi status
app.get('/status', (req, res) => {
  const data = getData();
  res.json(data);
});

// Endpoint to feed the Tamagotchi
app.post('/feed', (req, res) => {
  let data = getData();
  data.foodLevel = (data.foodLevel || 0) + 1;
  saveData(data);
  res.json({ message: 'Tamagotchi has been fed!' });
});

// Endpoint to reset the Tamagotchi food level
app.post('/reset', (req, res) => {
  let data = getData();
  data.foodLevel = 0; // Resets the food level
  saveData(data);
  res.json({ message: 'Tamagotchi has vomited all!' });
});

// Endpoint to feed empty (new route)
app.post('/feedEmpty', (req, res) => {
  let data = getData();

  // Implement your logic for "feedEmpty" here.
  // For example, decrement the food level or perform other actions.
  if (data.foodLevel > 0) {
    data.foodLevel -= 1;
    saveData(data);
    res.json({ message: 'Tamagotchi has been fed empty!' });
  } else {
    res.status(400).json({ message: 'Tamagotchi is already empty!' });
  }
});

// Endpoint to feed reveal (new route)
app.post('/feedReveal', (req, res) => {
  let data = getData();

  // Implement your logic for "feedReveal" here.
  // For example, reveal some hidden information or perform other actions.
  // Update the data object as needed.
  // Example: data.hiddenInfo = 'Revealed information';

  saveData(data);
  res.json({ message: 'Tamagotchi has been fed with a reveal!' });
});

// Route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
