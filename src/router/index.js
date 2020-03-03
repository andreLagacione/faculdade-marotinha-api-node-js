const router = require('express').Router();

router.use('/materia', require('../materia'));
router.use('/professor', require('../professor'));
router.use('/curso', require('../curso'));
router.use('/turma', require('../turma'));
router.use('/aluno', require('../aluno'));
router.use('/boletim', require('../boletim'));
router.use('/nota', require('../nota'));

module.exports = router;