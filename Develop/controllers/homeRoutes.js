// Dashboard route - Protected
router.get('/main', (req, res) => {
    if (req.session.loggedin) {
      res.send(`${randomMickeyGreetingAudio}`); // need to set up var for pulling random audio rec greeting
    } else {
      res.send('Please login to view this page!');
    }
    res.end();
  });