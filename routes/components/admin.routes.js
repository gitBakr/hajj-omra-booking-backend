const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middleware/auth');
const adminController = require('../../controllers/adminController');
const statsController = require('../../controllers/statsController');
const mongoose = require('mongoose');

// Log de démarrage
console.log('🔄 Chargement des routes admin...');

// Routes d'authentification
router.post('/login', adminController.login);
router.post('/test-auth', isAdmin, (req, res) => {
    res.json({ 
        success: true, 
        message: "Authentification admin réussie" 
    });
});

// Routes de gestion
router.post('/list', isAdmin, adminController.getPelerins);
router.post('/clean-db', isAdmin, adminController.cleanDB);
router.post('/stats/types', isAdmin, async (req, res) => {
    try {
        console.log('📊 Route /stats/types appelée:', {
            body: req.body,
            method: req.method,
            path: req.path
        });
        await statsController.getStatsByType(req, res);
    } catch (error) {
        console.error('❌ Erreur stats:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

// Route de vérification d'environnement
router.get('/env-check', async (req, res) => {
    try {
        console.log('🔍 Variables d\'environnement:', {
            NODE_ENV: process.env.NODE_ENV,
            ADMIN_EMAIL: process.env.ADMIN_EMAIL,
            hasAdminEmail: !!process.env.ADMIN_EMAIL,
            mongodbStatus: mongoose.connection.readyState
        });

        res.json({
            success: true,
            env: process.env.NODE_ENV,
            adminConfigured: !!process.env.ADMIN_EMAIL,
            timestamp: new Date(),
            serverStatus: {
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                nodeVersion: process.version
            }
        });
    } catch (error) {
        console.error('❌ Erreur env-check:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

// Route de vérification admin
router.get('/check', async (req, res) => {
    try {
        const { email } = req.query;
        
        console.log('🔍 Check admin status:', {
            receivedEmail: email,
            adminEmail: process.env.ADMIN_EMAIL,
            isMatch: email === process.env.ADMIN_EMAIL
        });

        res.json({
            success: true,
            isAdmin: email === process.env.ADMIN_EMAIL,
            email: email
        });
    } catch (error) {
        console.error('❌ Erreur check admin:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

// Log des routes configurées
console.log('📋 Routes admin configurées:', router.stack
    .filter(r => r.route)
    .map(r => `${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`)
);

module.exports = router; 