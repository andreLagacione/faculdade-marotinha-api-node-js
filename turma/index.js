const router = require('express').Router();
const turmaController = require('./controller/turmaController');

router.post('/list', turmaController.index);
router.post('', turmaController.store);

module.exports = router;