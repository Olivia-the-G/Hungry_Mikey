const router = require('express').Router();
const userRoutes = require('./userRoutes');
const buttonRoutes = require('./buttonRoutes');
const imageRoutes = require('./imageRoutes');
const aiRoutes = require('./aiRoutes');
// const statusRoutes = require('./statusRoutes');
// const activityRoutes = require('./activityRoutes');

router.use('/buttons', buttonRoutes);
router.use('/users', userRoutes);
router.use('/images', imageRoutes);
router.use('/ai', aiRoutes);
// router.use('/status', statusRoutes)
// router.use('/activity', activityRoutes);

module.exports = router;
