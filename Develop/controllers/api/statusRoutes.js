const router = require('express').Router();
const { getData } = require('../../utils/utils');

// get Mikey's status
router.get('/status', (req, res) => {
  const data = getData();
  res.json(data);
});

module.exports = router;