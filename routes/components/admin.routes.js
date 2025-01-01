const express = require('express');
const router = express.Router();
const Pelerin = require('../../models/Pelerin');

// Middleware d'authentification admin
const isAdmin = (req, res, next) => {
  const ADMIN_EMAIL = 'raouanedev@gmail.com'; // Temporaire pour test
  
  console.log('Body reçu:', JSON.stringify(req.body, null, 2));
  console.log('Headers reçus:', req.headers);
  
  const { email } = req.body;
  console.log('Email extrait:', email);
  console.log('Email admin attendu:', ADMIN_EMAIL);
  console.log('Email from env:', process.env.ADMIN_EMAIL);
  console.log('Comparaison:', email === ADMIN_EMAIL);

  if (!email) {
    console.log('Email manquant dans la requête');
    return res.status(400).json({ 
      message: "Email requis",
      received: req.body 
    });
  }

  if (email !== ADMIN_EMAIL) {
    console.log('Email incorrect');
    return res.status(403).json({ 
      message: "Accès non autorisé",
      receivedEmail: email,
      expectedEmail: ADMIN_EMAIL,
      envEmail: process.env.ADMIN_EMAIL
    });
  }

  console.log('Authentification admin réussie');
  next();
};

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

module.exports = router; 