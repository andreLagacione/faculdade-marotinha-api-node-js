const router = require('express').Router();
const turmaController = require('./controller/turmaController');

router.post('/list', turmaController.index);
router.post('', turmaController.store);

router.get('/:id', turmaController.show);

module.exports = router;