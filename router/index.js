const router = require('express').Router();

router.use('/materia', require('../materia'));
router.use('/professor', require('../professor'));
router.use('/curso', require('../curso'));

module.exports = router;