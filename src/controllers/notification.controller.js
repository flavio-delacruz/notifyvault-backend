const mongoose = require('mongoose');
const Device = require('../models/Device');
const NotificationLog = require('../models/NotificationLog');

const createNotification = async (req, res, next) => {
  try {
    const deviceToken = req.header('x-device-token');

    if (!deviceToken) {
      return res.status(401).json({ ok: false, message: 'x-device-token es requerido' });
    }

    const device = await Device.findOne({ deviceToken, isActive: true });

    if (!device) {
      return res.status(401).json({ ok: false, message: 'Dispositivo no autorizado' });
    }

    const { packageName, appName, title, text, links, receivedAt } = req.body;

    if (!packageName) {
      return res.status(400).json({ ok: false, message: 'packageName es requerido' });
    }

    let parsedReceivedAt = new Date();
    let rawReceivedAt = null;

    if (typeof receivedAt === 'number') {
      parsedReceivedAt = new Date(receivedAt);
      rawReceivedAt = receivedAt;
    } else if (receivedAt) {
      parsedReceivedAt = new Date(receivedAt);
    }

    if (Number.isNaN(parsedReceivedAt.getTime())) {
      return res.status(400).json({ ok: false, message: 'receivedAt invalido' });
    }

    const notification = await NotificationLog.create({
      device: device._id,
      deviceId: device.deviceId,
      packageName,
      appName: appName || '',
      title: title || '',
      text: text || '',
      links: Array.isArray(links) ? links : [],
      receivedAt: parsedReceivedAt,
      rawReceivedAt,
    });

    device.lastSeenAt = new Date();
    await device.save();

    res.status(201).json({
      ok: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

const listNotifications = async (req, res, next) => {
  try {
    const { appName, packageName, deviceId } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const skip = (page - 1) * limit;
    const filter = {};

    if (appName) {
      filter.appName = new RegExp(appName, 'i');
    }

    if (packageName) {
      filter.packageName = packageName;
    }

    if (deviceId) {
      filter.deviceId = deviceId;
    }

    const [notifications, total] = await Promise.all([
      NotificationLog.find(filter)
        .populate('device', 'deviceName platform appVersion lastSeenAt')
        .sort({ receivedAt: -1 })
        .skip(skip)
        .limit(limit),
      NotificationLog.countDocuments(filter),
    ]);

    res.json({
      ok: true,
      notifications,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getNotificationById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ ok: false, message: 'ID invalido' });
    }

    const notification = await NotificationLog.findById(req.params.id).populate(
      'device',
      'deviceName platform appVersion lastSeenAt',
    );

    if (!notification) {
      return res.status(404).json({ ok: false, message: 'Notificacion no encontrada' });
    }

    res.json({
      ok: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ ok: false, message: 'ID invalido' });
    }

    const notification = await NotificationLog.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ ok: false, message: 'Notificacion no encontrada' });
    }

    res.json({
      ok: true,
      message: 'Notificacion eliminada',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  listNotifications,
  getNotificationById,
  deleteNotification,
};
