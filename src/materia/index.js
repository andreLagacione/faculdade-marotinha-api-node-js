const router = require('express').Router();
const materiaController = require('./controller/materiaController');
const comboListController = require('./controller/comboListController');

router.post('/list', materiaController.index);
router.post('/', materiaController.store);
router.get('/combo-list', comboListController.index);
router.get('/:id', materiaController.show);
router.put('/', materiaController.update);
router.delete('/:id', materiaController.destroy);
module.exports = router;