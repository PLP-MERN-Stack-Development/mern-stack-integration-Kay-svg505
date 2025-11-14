// server/controllers/auth.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success:false, errors: errors.array() });

    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success:false, error: 'Email already in use' });

    user = await User.create({ name, email, password });
    const token = signToken(user._id);
    res.status(201).json({ success:true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, error: 'Provide email and password' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success:false, error: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success:false, error: 'Invalid credentials' });

    const token = signToken(user._id);
    res.json({ success:true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ success:false, error: 'Not authenticated' });
    res.json({ success:true, user: req.user });
  } catch (err) {
    next(err);
  }
};
