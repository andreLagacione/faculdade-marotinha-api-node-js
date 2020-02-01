const router = require('express').Router();
const professorController = require('./controller/professorController');

router.post('/list', professorController.index);

module.exports = router;