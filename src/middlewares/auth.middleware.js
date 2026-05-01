const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ ok: false, message: 'No autorizado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ ok: false, message: 'Usuario no encontrado' });
    }

    if (!user.isActive) {
      return res.status(403).json({ ok: false, message: 'Usuario inactivo' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ ok: false, message: 'Token invalido o expirado' });
  }
};

const onlyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ ok: false, message: 'Solo administradores' });
  }

  next();
};

module.exports = {
  protect,
  onlyAdmin,
};
