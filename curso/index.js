const router = require('express').Router();
const cursoController = require('./controller/cursoController');


router.post('/list', cursoController.index);
router.post('/', cursoController.store);
router.get('/:id', cursoController.show);

module.exports = router;