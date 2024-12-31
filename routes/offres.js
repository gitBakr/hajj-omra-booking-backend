const express = require('express');
const router = express.Router();
const Offre = require('../models/Offre');

// GET - Liste des offres
router.get('/', async (req, res) => {
  try {
    console.log('📋 Récupération des offres');
    const offres = await Offre.find().sort({ dateCreation: -1 });
    console.log('✅ Nombre d\'offres trouvées:', offres.length);
    res.json(offres);
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Créer une nouvelle offre
router.post('/', async (req, res) => {
  try {
    console.log('📝 Création d\'une nouvelle offre');
    console.log('📄 Body reçu (brut):', req.body);
    console.log('📄 Content-Type:', req.headers['content-type']);
    console.log('📄 Body est un objet?', typeof req.body === 'object');

    // Validation simple
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        message: "Le body doit être un objet JSON valide",
        reçu: req.body
      });
    }

    console.log('📄 Titre reçu:', req.body.titre);
    console.log('📄 Prix reçu:', req.body.prix);
    console.log('📄 Type du prix:', typeof req.body.prix);

    // Validation des champs
    if (!req.body.titre || !req.body.prix) {
      return res.status(400).json({ 
        message: "Le titre et le prix sont requis",
        reçu: {
          titre: req.body.titre,
          prix: req.body.prix
        }
      });
    }

    // Créer l'offre
    const offre = new Offre({
      titre: req.body.titre,
      prix: Number(req.body.prix) // Convertir explicitement en nombre
    });
    
    console.log('📄 Offre à sauvegarder:', offre);
    const savedOffre = await offre.save();
    console.log('✅ Offre créée:', JSON.stringify(savedOffre, null, 2));
    res.status(201).json(savedOffre);
  } catch (error) {
    console.error('❌ Erreur complète:', error);
    console.error('❌ Message d\'erreur:', error.message);
    if (error.errors) {
      console.error('❌ Erreurs de validation:', error.errors);
    }
    res.status(400).json({ 
      message: error.message,
      details: error.errors
    });
  }
});

module.exports = router; 