const router = require('express').Router();
const turmaController = require('./controller/turmaController');

router.post('/list', turmaController.index);
router.post('', turmaController.store);

router.get('/:id', turmaController.show);
router.put('/', turmaController.update);
router.delete('/:id', turmaController.destroy);

module.exports = router;