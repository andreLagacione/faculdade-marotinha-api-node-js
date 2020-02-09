const router = require('express').Router();
const cursoController = require('./controller/cursoController');


router.post('/list', cursoController.index);

module.exports = router;