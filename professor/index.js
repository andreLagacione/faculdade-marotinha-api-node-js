const router = require('express').Router();
const professorController = require('./controller/professorController');

router.post('/list', professorController.index);
router.post('/', professorController.store);

router.get('/:id', professorController.show);

module.exports = router;