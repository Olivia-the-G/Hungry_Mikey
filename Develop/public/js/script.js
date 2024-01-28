const statements = [
    "Welcome to the game, pal!",
    "Have you seen my pup, Pluo?",
    "I'm so hungry. Please feed me!",
    "Hunger pangs! What's on the menu, friend?",
    "Sailing works up an appetite!"
];

// Function to generate and render a random statement
function renderRandomStatement() {
    const randomIndex = Math.floor(Math.random() * statements.length);
    const randomStatement = statements[randomIndex];
    document.getElementById("randomStatement").textContent = randomStatement;
}

// Call the function initially and on button click
renderRandomStatement();