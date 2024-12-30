const express = require('express');
const router = express.Router();
const Pelerin = require('../models/Pelerin');

// Configuration admin
const ADMIN_EMAIL = 'raouanedev@gmail.com';

// POST - Créer un nouveau pèlerin
router.post('/', async (req, res) => {
  try {
    console.log('📝 Données reçues:', req.body);
    
    // Vérifier si l'email existe déjà
    const existingPelerin = await Pelerin.findOne({ email: req.body.email });
    if (existingPelerin) {
      return res.status(400).json({ 
        message: `Un(e) pèlerin(e) est déjà enregistré(e) avec cet email.`
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
    
    // Si c'est l'admin, renvoyer toutes les réservations
    if (email === ADMIN_EMAIL) {
      console.log('👑 Accès administrateur détecté');
      const allReservations = await Pelerin.find().sort({ dateInscription: -1 });
      console.log('✅ Nombre total de réservations:', allReservations.length);
      return res.json(allReservations);
    }
    
    // Sinon, renvoyer uniquement les réservations de l'utilisateur
    const reservations = await Pelerin.find({ email }).sort({ dateInscription: -1 });
    console.log('✅ Réservations trouvées:', reservations.length);
    
    res.json(reservations);
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Nettoyer la base de données (développement uniquement)
router.delete('/clean', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Non autorisé en production' });
  }
  
  try {
    await Pelerin.deleteMany({});
    console.log('🧹 Base de données nettoyée');
    res.json({ message: 'Données supprimées avec succès' });
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 