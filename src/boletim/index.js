const router = require('express').Router();
const boletimController = require('./controller/boletimController');
const reportController = require('./controller/reportController');

router.post('/list', boletimController.index);
router.post('/', boletimController.store);
router.get('/gerar/:id', reportController.generate);
router.get('/:id', boletimController.show);
router.put('/', boletimController.update);
router.delete('/:id', boletimController.destroy);
module.exports = router;