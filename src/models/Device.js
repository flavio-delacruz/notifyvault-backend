const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    deviceName: {
      type: String,
      default: 'Android device',
      trim: true,
    },
    platform: {
      type: String,
      default: 'android',
      trim: true,
    },
    appVersion: {
      type: String,
      default: '1.0.0',
      trim: true,
    },
    deviceToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Device', deviceSchema);
