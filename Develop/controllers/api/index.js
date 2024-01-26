const router = require('express').Router();
const userRoutes = require('./userRoutes');
const activityRoutes = require('./activityRoutes');
const buttonRoutes = require('./buttonRoutes');

router.use('/buttons', buttonRoutes);
router.use('/users', userRoutes);
router.use('/activity', activityRoutes);

module.exports = router;
