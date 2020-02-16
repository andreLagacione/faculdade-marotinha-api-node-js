const router = require('express').Router();
const alunoController = require('./controller/alunoController');

router.post('/list', alunoController.index);
router.post('/', alunoController.store);

router.get('/:id', alunoController.show);
router.put('/', alunoController.update);


module.exports = router;