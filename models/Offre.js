const mongoose = require('mongoose');

const offreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['hajj', 'omra'],
    required: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Offre', offreSchema); 