const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/forms', require('./forms'));
router.use('/submissions', require('./submissions'));

module.exports = router;