const router = require('express').Router();
const boletimController = require('./controller/boletimController');

router.post('/list', boletimController.index);
router.post('/', boletimController.store);
router.get('/:id', boletimController.show);
router.put('/', boletimController.update);
router.delete('/:id', boletimController.destroy);
module.exports = router;