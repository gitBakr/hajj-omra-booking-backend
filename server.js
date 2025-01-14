require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log('📥 Requête reçue:', req.method, req.url);
  console.log('📦 Headers:', req.headers);
  console.log('📝 Body:', req.body);
  next();
});
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Import des routes
console.log('🔄 Chargement des routes...');

const heroRoutes = require('./routes/components/hero.routes');
const offreRoutes = require('./routes/components/offres.routes');
const pelerinRoutes = require('./routes/components/pelerin.routes');
const adminRoutes = require('./routes/components/admin.routes');
const uploadRoutes = require('./routes/components/upload.routes');

// Configuration des routes avec logs
console.log('📍 Configuration des routes...');

// Hero routes
app.use('/hero', heroRoutes);
console.log('✅ Routes hero chargées');

// Autres routes
app.use('/offres', offreRoutes);
app.use('/pelerin', pelerinRoutes);
app.use('/admin', adminRoutes);
app.use('/upload', uploadRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ Connecté à MongoDB');
        
        // Log toutes les routes après connexion
        console.log('\n📋 Routes disponibles:');
        app._router.stack
            .filter(r => r.route || r.name === 'router')
            .forEach(r => {
                if (r.route) {
                    console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
                } else {
                    console.log(`\nRouter ${r.regexp}:`);
                    r.handle.stack
                        .filter(l => l.route)
                        .forEach(l => {
                            console.log(`- ${Object.keys(l.route.methods)} ${l.route.path}`);
                        });
                }
            });
    })
    .catch(err => console.error('❌ Erreur MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
