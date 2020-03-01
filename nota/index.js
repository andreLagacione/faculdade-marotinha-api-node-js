const router = require('express').Router();
const notaController = require('./controller/notaController');
// const comboListController = require('./controller/comboListController');

// router.post('/list', notaController.index);
router.post('/', notaController.store);
// router.get('/combo-list', comboListController.index);
router.get('/id-boletim/:id', notaController.index);
// router.put('/', notaController.update);
// router.delete('/:id', notaController.destroy);
module.exports = router;