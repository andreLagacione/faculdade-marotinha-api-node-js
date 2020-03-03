const router = require('express').Router();
const professorController = require('./controller/professorController');
const comboListController = require('./controller/comboListController');

router.post('/list', professorController.index);
router.post('/', professorController.store);
router.get('/combo-list', comboListController.index);
router.get('/:id', professorController.show);
router.put('/', professorController.update);
router.delete('/:id', professorController.destroy);
module.exports = router;