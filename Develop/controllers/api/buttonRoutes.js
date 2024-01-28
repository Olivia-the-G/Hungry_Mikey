const router = require('express').Router();
const { appendToDataLog, getData, saveData, predictMood } = require('../../utils/utils');
// const { getData, saveData, predictMood, appendToDataLog } = require('../../utils'); // Assuming utility functions are extracted

// endpoint to feed healthy
router.post('/feedHealthy', (req, res) => {
  let data = getData();
  data.foodLevel = (data.foodLevel || 0) + 5;
  data.size = (data.size || 0) + 1;

  let input = { healthy: 1, empty: 0, reveal: 0, bad: 0 };
  data.mood = predictMood(input).mood;

  saveData(data);

  const logEntry = {
      action: 'feedHealthy',
      response: 'Mikey is happy and well-fed!',
      moodChange: data.mood - (data.mood - 1),
      timestamp: new Date().toISOString(),
  };
  appendToDataLog(logEntry, 'dataFeedLog.json');

  let responseMessages = {
      highMood: "Mikey is happy and well-fed!",
      mediumMood: "Mikey is feeling okay after the meal.",
      lowMood: "Mikey is not very happy with that food."
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
router.post('/feedEmpty', (req, res) => {
  let data = getData();

  // check if the Mikey has any food level left
  if (data.foodLevel > 0) {
      // Decrement food level by 1
      data.foodLevel -= 1;

      // input mood prediction is constant for this feed type
      data.mood = predictMood({ healthy: 0, empty: 1, reveal: 0, bad: 0 }).mood;

      const logEntry = {
          action: 'feedEmpty',
          response: 'Mikey is fed empty.',
          moodChange: data.mood - predictMood({ healthy: 0, empty: 1, reveal: 0, bad: 0 }).mood // Calculate mood change
      };
      appendToDataLog(logEntry, 'dataFeedLog.json');

      saveData(data);

      res.json({ message: 'Mikey has been fed empty!', foodLevel: data.foodLevel, mood: data.mood });
  } else {
      // if food level is already at 0, send a success response with no further action
      res.json({ message: 'Mikey has no food left!', foodLevel: data.foodLevel, mood: data.mood });
  }
});


// endpoint to feed reveal
router.post('/feedReveal', (req, res) => {
  let data = getData();
  data.size = (data.size || 0);

  let input = { healthy: 0, empty: 0, reveal: 1, bad: 0 };
  data.mood = predictMood(input).mood;

  const logEntry = {
      action: 'feedReveal',
      response: 'Mikey is fed with a reveal.',
      moodChange: data.mood - predictMood(input).mood // calculate mood change
  };
  appendToDataLog(logEntry, 'dataFeedLog.json');

  saveData(data);

  res.json({ message: 'Mikey has been fed with a reveal!', size: data.size, mood: data.mood });
});



// endpoint to feed bad
router.post('/feedBad', (req, res) => {
  let data = getData();

  // update food level and size
  data.foodLevel = Math.max(0, (data.foodLevel || 0) - 10);
  data.size = Math.max(0, (data.size || 0) - 10); // Ensuring size doesn't go negative

  // input mood prediction is constant for this feed type
  let moodPrediction = predictMood({ healthy: 0, empty: 0, reveal: 0, bad: 1 });

  // generate a response message based on the mood prediction
  let responseMessage = '';
  if (moodPrediction.mood >= 0.8) {
      responseMessage = 'Mikey is upset after a bad meal!';
  } else if (moodPrediction.mood >= 0.6) {
      responseMessage = 'Mikey is not happy about the bad meal.';
  } else if (moodPrediction.mood >= 0.4) {
      responseMessage = 'Mikey is disappointed with the bad meal.';
  } else {
      responseMessage = 'Mikey is very unhappy after a bad meal.';
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

module.exports = router;