const { Router } = require('express');
const productController = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');

const router = Router();

router.get('/', productController.list);
router.post('/', requireAuth, productController.create);
router.put('/:id', requireAuth, productController.update);
router.delete('/:id', requireAuth, productController.remove);

module.exports = router;
