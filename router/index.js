const router = require('express').Router();

router.use('/materia', require('../materia'));
router.use('/professor', require('../professor'));
router.use('/curso', require('../curso'));
router.use('/turma', require('../turma'));

module.exports = router;