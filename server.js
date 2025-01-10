require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const pelerinRoutes = require('./routes/components/pelerin.routes');
const offresRoutes = require('./routes/components/offres.routes');
const adminRoutes = require('./routes/components/admin.routes');

const app = express();
const port = process.env.PORT || 8080;

// Configuration CORS
app.use(cors({
  origin: [
    'https://hajj-omra-booking-frontend.onrender.com',
    'https://hajj-omra-booking-1.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:5000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser le JSON
app.use(express.json());

// Avant la définition des routes
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/offres', offresRoutes);
app.use('/pelerin', pelerinRoutes);
app.use('/admin', adminRoutes);

// Route de healthcheck
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Connexion MongoDB et démarrage du serveur
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB avec succès');
    console.log('Admin email configuré:', process.env.ADMIN_EMAIL);
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur le port ${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err);
    process.exit(1);
  }); 