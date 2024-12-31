const express = require('express');
const router = express.Router();
const Pelerin = require('../models/Pelerin');

// Configuration admin
const ADMIN_EMAIL = 'raouanedev@gmail.com';

console.log('🚀 Routes pèlerin chargées');

// POST - Créer un nouveau pèlerin
router.post('/', async (req, res) => {
  try {
    console.log('📝 Données reçues:', req.body);
    
    // Vérifier si la combinaison nom/prénom existe déjà
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

// GET - Route de test
router.get('/test', (req, res) => {
  console.log('🧪 Route de test appelée');
  res.json({ message: 'Route de test OK' });
});

// Middleware d'authentification
const isAdmin = (req, res, next) => {
  const { email } = req.query;
  if (email !== ADMIN_EMAIL) {
    return res.status(403).json({ 
      message: "Accès non autorisé. Seul l'administrateur peut voir la liste complète." 
    });
  }
  next();
};

// GET - Route de base (protégée)
router.get('/', isAdmin, async (req, res) => {
  try {
    console.log('📋 Récupération de tous les pèlerins');
    console.log('👑 Accès administrateur:', req.query.email);
    const pelerins = await Pelerin.find().sort({ dateInscription: -1 });
    console.log('✅ Nombre de pèlerins trouvés:', pelerins.length);
    res.json(pelerins);
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 