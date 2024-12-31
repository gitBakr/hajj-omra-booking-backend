const express = require('express');
const router = express.Router();
const Pelerin = require('../../models/Pelerin');

// Middleware d'authentification admin
const isAdmin = (req, res, next) => {
  const { email } = req.body;
  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Accès non autorisé" });
  }
  next();
};

// POST - Liste des pèlerins (admin)
router.post('/list', isAdmin, async (req, res) => {
  try {
    const pelerins = await Pelerin.find().sort({ dateInscription: -1 });
    console.log('✅ Nombre de pèlerins trouvés:', pelerins.length);
    res.json(pelerins);
  } catch (error) {
    console.error('❌ Erreur:', error);
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

module.exports = router; 