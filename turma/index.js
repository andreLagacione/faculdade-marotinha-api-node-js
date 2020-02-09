const router = require('express').Router();
const turmaController = require('./controller/turmaController');

router.post('/list', turmaController.index);

module.exports = router;