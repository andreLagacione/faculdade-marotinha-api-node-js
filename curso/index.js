const router = require('express').Router();
const cursoController = require('./controller/cursoController');
const comboListController = require('./controller/comboListController');

router.post('/list', cursoController.index);
router.post('/', cursoController.store);
router.get('/combo-list', comboListController.index);
router.get('/:id', cursoController.show);
router.put('/', cursoController.update);
router.delete('/:id', cursoController.destroy);
module.exports = router;