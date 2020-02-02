const router = require('express').Router();
const professorController = require('./controller/professorController');

router.post('/list', professorController.index);
router.post('/', professorController.store);

module.exports = router;