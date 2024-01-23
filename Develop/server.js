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

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

// Dashboard route - Protected
router.get('/main', (req, res) => {
  if (req.session.loggedin) {
    res.send(`${randomMickeyGreetingAudio}`); // need to set up var for pulling random audio rec greeting
  } else {
    res.send('Please login to view this page!');
  }
  res.end();
});

// Set up server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});