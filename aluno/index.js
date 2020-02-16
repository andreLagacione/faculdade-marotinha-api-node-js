const router = require('express').Router();
const alunoController = require('./controller/alunoController');

router.post('/list', alunoController.index);


module.exports = router;