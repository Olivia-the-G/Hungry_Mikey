const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');

// http://localhost:3001/
router.get('/', async (req, res) => {
  try {
    res.render('homepage', { 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//http://localhost:3001/parent/1
router.get('/parent/:id', async (req, res) => {
  try {
    const parentData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const parent = parentData.get({ plain: true });

    res.render('parent', {
      ...parent,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// //http://localhost:3001/profile
// // Use withAuth middleware to prevent access to route
// router.get('/profile', withAuth, async (req, res) => {
//   try {
//     // Find the logged in user based on the session ID
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: Project }],
//     });

//     const user = userData.get({ plain: true });

//     res.render('profile', {
//       ...user,
//       logged_in: true
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/game');
    return;
  }

  res.render('login');
});

// handlebar routes for returning to game
router.get('/game', (req, res) => {
  res.render('game', { title: 'Hungry Mikey' });
});

// handlebars routes for parental control page
router.get('/parental-control', (req, res) => {
  res.render('parentalControl', { title: 'Parental Control Switch' });
});

module.exports = router;


// router.get('/main', (req, res) => {
//     if (req.session.loggedin) {
//       res.send(`${randomMickeyGreetingAudio}`); // need to set up var for pulling random audio rec greeting
//     } else {
//       res.send('Please login to view this page!');
//     }
//     res.end();
//   });