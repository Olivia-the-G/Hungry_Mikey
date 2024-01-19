const router = require('express').Router();

const userDataRoutes = require('/userData.js');

router.use('/userData', userDataRoutes);

module.exports = router;