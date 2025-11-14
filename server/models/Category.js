// server/models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

CategorySchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  this.slug = this.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  next();
});

module.exports = mongoose.model('Category', CategorySchema);
