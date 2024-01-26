const router = require('express').Router();
const userRoutes = require('./userRoutes');
const sessionRoutes = require('./sessionRoutes');
const buttonRoutes = require('./buttonRoutes');

router.use('/buttons', buttonRoutes);
router.use('/users', userRoutes);
router.use('/session', sessionRoutes);

module.exports = router;
