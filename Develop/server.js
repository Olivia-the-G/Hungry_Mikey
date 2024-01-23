const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const Sequelize = require('./config/connection');
const mysql = require('mysql2');
const router = require('express').Router();

const hbs = exphbs.create({});
const app = express();
const PORT = process.env.PORT || 3001;

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

// Configure express-session middleware
app.use(session({
  secret: `${userPassword}`, //user's password input goes here
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto' }
}));

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

// Set up server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});