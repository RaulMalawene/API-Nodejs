const { Router } = require('express');
const appointmentController = require('../controllers/appointmentController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', requireAuth, appointmentController.list);
router.post('/', appointmentController.create);
router.patch('/:id/status', requireAuth, appointmentController.updateStatus);

module.exports = router;
