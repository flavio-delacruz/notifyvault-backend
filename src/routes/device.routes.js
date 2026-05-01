const { Router } = require('express');
const { registerDevice, listDevices } = require('../controllers/device.controller');
const { protect, onlyAdmin } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/register', registerDevice);
router.get('/', protect, onlyAdmin, listDevices);

module.exports = router;
