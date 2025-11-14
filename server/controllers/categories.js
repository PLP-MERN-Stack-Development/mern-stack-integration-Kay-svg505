// server/controllers/categories.js
const Category = require('../models/Category');
const { validationResult } = require('express-validator');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json({ success:true, data: categories });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success:false, errors: errors.array() });

    const { name } = req.body;
    let category = await Category.findOne({ name });
    if (category) return res.status(400).json({ success:false, error: 'Category exists' });

    category = await Category.create({ name });
    res.status(201).json({ success:true, data: category });
  } catch (err) { next(err); }
};
