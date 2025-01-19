require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Configuration CORS avec les origines autorisées
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://hajj-omra-booking.vercel.app',
    'https://powderblue-deer-333918.hostingersite.com'
];

// Middleware CORS avec configuration
app.use(cors({
    origin: function (origin, callback) {
        // Permettre les requêtes sans origine (comme Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('❌ Origine bloquée:', origin);
            callback(new Error('Non autorisé par CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log('📥 Requête reçue:', req.method, req.url);
  console.log('📦 Headers:', req.headers);
  console.log('📝 Body:', req.body);
  next();
});
app.use('/uploads', express.static('uploads'));

// Import des routes
console.log('🔄 Chargement des routes...');

const heroRoutes = require('./routes/components/hero.routes');
const offreRoutes = require('./routes/components/offres.routes');
const pelerinRoutes = require('./routes/components/pelerin.routes');
const adminRoutes = require('./routes/components/admin.routes');
const uploadRoutes = require('./routes/components/upload.routes');
const galleryRoutes = require('./routes/components/gallery.routes');

// Configuration des routes avec logs
console.log('📍 Configuration des routes...');

// Gallery routes
app.use('/gallery', galleryRoutes);

// Hero routes
app.use('/hero', heroRoutes);
console.log('✅ Routes hero chargées');

// Autres routes
app.use('/offres', offreRoutes);
app.use('/pelerin', pelerinRoutes);
app.use('/admin', adminRoutes);
app.use('/upload', uploadRoutes);

// Ajouter une route de santé
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        env: process.env.NODE_ENV,
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

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

// Vérification des routes
console.log('Routes disponibles:', 
    app._router.stack
        .filter(r => r.route || r.name === 'router')
        .map(r => {
            if (r.route) {
                return `${Object.keys(r.route.methods)} ${r.route.path}`;
            }
            if (r.name === 'router') {
                return `Router: ${r.regexp}`;
            }
        })
        .filter(Boolean)
);

// Après la configuration des routes
console.log('Routes configurées:', 
    app._router.stack
        .filter(r => r.route || r.name === 'router')
        .map(r => {
            if (r.route) {
                return `${Object.keys(r.route.methods)} ${r.route.path}`;
            }
            if (r.name === 'router') {
                return `Router [${r.regexp.toString().split('/')[1]}]`;
            }
        })
        .filter(Boolean)
);
