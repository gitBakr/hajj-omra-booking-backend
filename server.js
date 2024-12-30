const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://hajj-omra-booking-1.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Connexion MongoDB avec logs - sans options dépréciées
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB avec succès');
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
  });

// Routes
const pelerinRoutes = require('./routes/pelerin');
app.use('/api/pelerins', pelerinRoutes);

// Forcer le port 5001
const PORT = 5001;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
}); 