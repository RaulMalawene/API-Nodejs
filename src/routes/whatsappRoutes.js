const { Router } = require('express');
const { isWhatsappReady } = require('../whatsapp/client');

const router = Router();

router.get('/status', (req, res) => {
  res.json({ connected: isWhatsappReady() });
});

module.exports = router;
