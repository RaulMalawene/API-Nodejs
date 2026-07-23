const { Router } = require('express');
const serviceController = require('../controllers/serviceController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', serviceController.list);
router.post('/', requireAuth, serviceController.create);
router.put('/:id', requireAuth, serviceController.update);
router.delete('/:id', requireAuth, serviceController.remove);

module.exports = router;
