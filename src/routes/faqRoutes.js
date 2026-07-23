const { Router } = require('express');
const faqController = require('../controllers/faqController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', faqController.list);
router.post('/', requireAuth, faqController.create);
router.put('/:id', requireAuth, faqController.update);
router.delete('/:id', requireAuth, faqController.remove);

module.exports = router;
