const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    packageName: {
      type: String,
      required: true,
      trim: true,
    },
    appName: {
      type: String,
      default: '',
      trim: true,
    },
    title: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    links: {
      type: [String],
      default: [],
    },
    receivedAt: {
      type: Date,
      required: true,
    },
    rawReceivedAt: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
