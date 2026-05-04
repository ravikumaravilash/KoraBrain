const mongoose = require('mongoose');

const MonumentSchema = new mongoose.Schema({
  name: String,
  location: String,
  etiquette: [String],
  stories: [String],
  food: [String]
});

module.exports = mongoose.model('Monument', MonumentSchema);

