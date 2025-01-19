const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middleware/auth');
const adminController = require('../../controllers/adminController');
const statsController = require('../../controllers/statsController');

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
router.post('/stats/types', isAdmin, async (req, res) => {
    try {
        await statsController.getStatsByType(req, res);
    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
});

module.exports = router; 