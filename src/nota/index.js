const router = require('express').Router();
const notaController = require('./controller/notaController');

router.post('/', notaController.store);
router.get('/id-boletim/:id', notaController.index);
router.get('/:id', notaController.show);
router.put('/', notaController.update);
router.delete('/:id', notaController.destroy);
module.exports = router;