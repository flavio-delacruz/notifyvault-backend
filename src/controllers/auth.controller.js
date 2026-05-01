const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
});

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'name, email y password son requeridos',
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ ok: false, message: 'El email ya esta registrado' });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: req.body.role === 'admin' ? 'admin' : 'viewer',
    });

    const token = generateToken({ id: user._id, role: user.role });

    res.status(201).json({
      ok: true,
      token,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'email y password son requeridos',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ ok: false, message: 'Credenciales invalidas' });
    }

    if (!user.isActive) {
      return res.status(403).json({ ok: false, message: 'Usuario inactivo' });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.json({
      ok: true,
      token,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json({
    ok: true,
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  me,
};
