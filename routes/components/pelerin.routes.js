const express = require('express');
const router = express.Router();
const Pelerin = require('../../models/Pelerin');

// POST - Créer un nouveau pèlerin
router.post('/', async (req, res) => {
  try {
    console.log('📝 Données reçues:', req.body);
    
    const existingPelerin = await Pelerin.findOne({ 
      nom: req.body.nom,
      prenom: req.body.prenom
    });
    
    if (existingPelerin) {
      return res.status(400).json({ 
        message: `Un(e) pèlerin(e) avec ce nom et prénom est déjà enregistré(e).`
      });
    }

    const pelerin = new Pelerin(req.body);
    const savedPelerin = await pelerin.save();
    
    console.log('✅ Pèlerin enregistré:', savedPelerin);
    res.status(201).json(savedPelerin);
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(400).json({ message: error.message });
  }
});

// GET - Rechercher les réservations par email
router.get('/search', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('🔍 Recherche pour email:', email);
    
    const reservations = await Pelerin.find({ email }).sort({ dateInscription: -1 });
    console.log('✅ Réservations trouvées:', reservations.length);
    
    res.json(reservations);
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 