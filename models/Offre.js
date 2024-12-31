const mongoose = require('mongoose');

const offreSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['hajj', 'omra']
  },
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dateDepart: {
    type: String,
    required: true
  },
  dateRetour: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  places: {
    total: {
      type: Number,
      required: true
    },
    disponibles: {
      type: Number,
      required: true
    }
  },
  prestations: {
    hotel: {
      nom: String,
      etoiles: Number,
      localisation: String
    },
    vol: {
      compagnie: String,
      escales: Number
    },
    transport: {
      type: String,
      description: String
    }
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  statut: {
    type: String,
    enum: ['active', 'complete', 'annulee'],
    default: 'active'
  }
});

module.exports = mongoose.model('Offre', offreSchema); 