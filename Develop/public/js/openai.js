document.addEventListener('DOMContentLoaded', () => {
    fetchMessage();
  });
  
const statements = [
    "Welcome to the game, pal!",
    "Have you seen my pup, Pluo?",
    "I'm so hungry. Please feed me!",
    "Hunger pangs! What's on the menu, friend?",
    "Sailing works up an appetite!",
    "I'm becoming shelf-aware..."
];

  function fetchMessage() {
    const requestData = {
      messages: [{
        role: "user", 
        content: `use ${statements} as examples. generate only one mickey mouse and healthy food-inspired statement to greet a user to a game for kids. 4-8 words only. never say mickey mouse or any other disney character's name. use puns.` 
        }],
    };
  
    fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
      displayMessage(data.message);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  
  function displayMessage(message) {
    document.getElementById('message').textContent = message;
  }