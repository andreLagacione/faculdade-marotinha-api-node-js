const router = require('express').Router();

router.use('/materia', require('../materia'));
router.use('/professor', require('../professor'));

module.exports = router;