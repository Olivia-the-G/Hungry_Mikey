const router = require('express').Router();
const User = require('../models/User');

// route to get a certain user's data
router.get('/user/:id', async (req, res) => {
  try{
      const userData = await User.findByPk(req.params.id);
      if(!userData) {
        res.status(404).json({message: 'User not found'});
        return;
      }
      res.render('User', userData);
    } catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router;
