const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import des routes
console.log('🔄 Chargement des routes...');

const heroRoutes = require('./routes/components/hero.routes');
const offreRoutes = require('./routes/components/offres.routes');
const pelerinRoutes = require('./routes/components/pelerin.routes');
const adminRoutes = require('./routes/components/admin.routes');
const uploadRoutes = require('./routes/components/upload.routes');

// Configuration des routes avec logs
console.log('📍 Configuration des routes hero...');
app.use('/hero', heroRoutes);

console.log('📍 Configuration des autres routes...');
app.use('/offres', offreRoutes);
app.use('/pelerins', pelerinRoutes);
app.use('/admin', adminRoutes);
app.use('/upload', uploadRoutes);

// Servir les fichiers statiques
app.use('/uploads', express.static('uploads'));

// Log des routes configurées
console.log('📋 Routes disponibles:');
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods).join(',')} ${r.route.path}`);
    } else if (r.name === 'router') {
        console.log(`Router: ${r.regexp}`);
        r.handle.stack.forEach((layer) => {
            if (layer.route) {
                const methods = Object.keys(layer.route.methods).join(',');
                console.log(`- ${methods} ${layer.route.path}`);
            }
        });
    }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

module.exports = app; 