const { Router } = require('express');
const {
  createNotification,
  listNotifications,
  getNotificationById,
  deleteNotification,
} = require('../controllers/notification.controller');
const { protect, onlyAdmin } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', createNotification);
router.get('/', protect, onlyAdmin, listNotifications);
router.get('/:id', protect, onlyAdmin, getNotificationById);
router.delete('/:id', protect, onlyAdmin, deleteNotification);

module.exports = router;
