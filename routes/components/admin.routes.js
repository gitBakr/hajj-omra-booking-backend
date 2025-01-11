const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middleware/auth');
const Pelerin = require('../../models/Pelerin');
const Offre = require('../../models/Offre');

// Log pour vérifier le chargement des routes
console.log('🔄 Chargement des routes admin...');

// Route de test d'authentification admin
router.post('/test-auth', isAdmin, (req, res) => {
    console.log('📝 Test auth appelé');
    res.json({ 
        success: true, 
        message: "Authentification admin réussie",
        email: req.body.email
    });
});

// POST - Liste des pèlerins (admin)
router.post('/list', isAdmin, async (req, res) => {
  try {
    console.log('Récupération de la liste des pèlerins');
    const pelerins = await Pelerin.find().sort({ dateInscription: -1 });
    console.log('Nombre de pèlerins trouvés:', pelerins.length);
    res.json(pelerins);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Statistiques (admin)
router.post('/stats', isAdmin, async (req, res) => {
  try {
    // ... code des statistiques ...
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

// Ajouter cette route pour nettoyer la DB
router.post('/clean-db', isAdmin, async (req, res) => {
  try {
    console.log('🧹 Nettoyage de la base de données...');
    
    // Supprimer toutes les réservations
    await Pelerin.deleteMany({});
    console.log('✅ Toutes les réservations ont été supprimées');
    
    // Supprimer toutes les offres
    await Offre.deleteMany({});
    console.log('✅ Toutes les offres ont été supprimées');

    res.json({ 
      message: "Base de données nettoyée avec succès",
      timestamp: new Date()
    });
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
    res.status(500).json({ message: error.message });
  }
});

// Route de login admin
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ 
                success: false,
                message: "Accès non autorisé" 
            });
        }

        res.json({ 
            success: true,
            message: "Login admin réussi",
            email: email
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour vérifier les variables d'environnement
router.get('/env-check', async (req, res) => {
    try {
        console.log('🔍 Variables d\'environnement:', {
            NODE_ENV: process.env.NODE_ENV,
            ADMIN_EMAIL: process.env.ADMIN_EMAIL,
            hasAdminEmail: !!process.env.ADMIN_EMAIL
        });

        res.json({
            success: true,
            env: process.env.NODE_ENV,
            adminEmail: process.env.ADMIN_EMAIL || 'Non configuré',
            isConfigured: !!process.env.ADMIN_EMAIL
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour vérifier le statut admin
router.get('/check', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Log pour debug
        console.log('🔍 Check admin status:', {
            receivedEmail: email,
            adminEmail: process.env.ADMIN_EMAIL,
            isMatch: email === process.env.ADMIN_EMAIL
        });

        // Vérifier si c'est l'admin
        const isAdmin = email === process.env.ADMIN_EMAIL;

        res.json({
            success: true,
            isAdmin: isAdmin,
            email: email
        });
    } catch (error) {
        console.error('❌ Erreur check admin:', error);
        res.status(500).json({ message: error.message });
    }
});

// Log des routes configurées
console.log('📋 Routes admin configurées:', router.stack.map(r => {
    if (r.route) return `${Object.keys(r.route.methods)[0].toUpperCase()} /admin${r.route.path}`;
}).filter(Boolean));

module.exports = router; 