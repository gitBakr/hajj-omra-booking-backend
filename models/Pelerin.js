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
    numero: {
      type: String,
      required: true
    },
    rue: {
      type: String,
      required: true
    },
    ville: {
      type: String,
      required: true
    },
    codePostal: {
      type: String,
      required: true
    }
  },
  typePelerinage: {
    type: String,
    required: true,
    enum: ['hajj', 'omra']
  },
  dateDepart: {
    type: String,
    required: true
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