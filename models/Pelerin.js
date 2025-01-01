const mongoose = require('mongoose');

const pelerinSchema = new mongoose.Schema({
  civilite: {
    type: String,
    required: true,
    enum: ['M.', 'Mme', 'Mlle']
  },
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  nationalite: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  adresse: {
    numero: String,
    rue: String,
    ville: String,
    codePostal: String
  },
  typePelerinage: {
    type: String,
    required: true,
    enum: ['hajj', 'omra']
  },
  dateDepart: {
    type: String,
    required: false
  },
  besoinsSpeciaux: String,
  chambre: {
    type: {
      type: String,
      enum: ['quadruple', 'triple', 'double']
    },
    supplement: {
      type: Number,
      default: 0
    }
  },
  dateInscription: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pelerin', pelerinSchema); 