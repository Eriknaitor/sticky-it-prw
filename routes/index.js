const router = require('express').Router();

router.use('/', require('./user'));
router.use('/', require('./note'));
router.use('/', require('./report'));

module.exports = router;