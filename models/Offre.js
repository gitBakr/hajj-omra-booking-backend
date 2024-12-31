const mongoose = require('mongoose');

const offreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  prix: {
    type: Number,
    required: true,
    min: 0
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Offre', offreSchema); 