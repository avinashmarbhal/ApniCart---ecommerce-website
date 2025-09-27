const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g. "electronics"
    description: String,
  });


module.exports = mongoose.model('Category', categorySchema);
  