// server/routes/categories.js
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const categoriesCtrl = require('../controllers/categories');

router.get('/', categoriesCtrl.getAll);

router.post('/', protect, authorize('admin'), [ check('name','Name is required').notEmpty() ], categoriesCtrl.create);

module.exports = router;
