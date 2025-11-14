// server/routes/auth.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post(
  '/register',
  [
    check('name','Name is required').notEmpty(),
    check('email','Valid email required').isEmail(),
    check('password','Password min 6 chars').isLength({ min: 6 }),
  ],
  authController.register
);

router.post('/login', authController.login);

router.get('/me', protect, authController.me);

module.exports = router;
