const { v4: uuidv4 } = require('uuid');
const Device = require('../models/Device');

const registerDevice = async (req, res, next) => {
  try {
    const { deviceId, deviceName, platform, appVersion } = req.body;

    if (!deviceId) {
      return res.status(400).json({ ok: false, message: 'deviceId es requerido' });
    }

    let device = await Device.findOne({ deviceId });

    if (!device) {
      device = await Device.create({
        deviceId,
        deviceName: deviceName || 'Android device',
        platform: platform || 'android',
        appVersion: appVersion || '1.0.0',
        deviceToken: uuidv4(),
        isActive: true,
        lastSeenAt: new Date(),
      });
    } else {
      device.deviceName = deviceName || device.deviceName;
      device.platform = platform || device.platform;
      device.appVersion = appVersion || device.appVersion;
      device.isActive = true;
      device.lastSeenAt = new Date();
      await device.save();
    }

    res.status(201).json({
      ok: true,
      deviceToken: device.deviceToken,
      device: {
        id: device._id,
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        platform: device.platform,
        appVersion: device.appVersion,
        isActive: device.isActive,
        lastSeenAt: device.lastSeenAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const listDevices = async (req, res, next) => {
  try {
    const devices = await Device.find().sort({ createdAt: -1 });

    res.json({
      ok: true,
      devices,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerDevice,
  listDevices,
};
