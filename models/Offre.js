const mongoose = require('mongoose');

const offreSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  titre: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['hajj', 'omra']
  },
  prix: {
    type: Number,
    required: true
  },
  duree: String,
  description: String,
  image: String,
  details: {
    depart: String,
    hotel: String,
    included: [String],
    notIncluded: [String],
    programme: String
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Offre', offreSchema); 