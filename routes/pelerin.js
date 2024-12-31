const express = require('express');
const router = express.Router();
const Pelerin = require('../models/Pelerin');
const Offre = require('../models/Offre');

// Configuration admin
const ADMIN_EMAIL = 'raouanedev@gmail.com';

console.log('🚀 Routes pèlerin chargées');

// Middleware d'authentification pour les routes protégées
const isAdmin = (req, res, next) => {
  const { email } = req.body;
  if (email !== ADMIN_EMAIL) {
    return res.status(403).json({ 
      message: "Accès non autorisé. Seul l'administrateur peut voir la liste complète." 
    });
  }
  next();
};

// Routes pour les offres (sans vérification admin)
const offresRouter = express.Router();

// GET - Liste des offres
offresRouter.get('/', async (req, res) => {
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

// POST - Créer une nouvelle offre (simplifié, sans vérification admin)
offresRouter.post('/', async (req, res) => {
  try {
    console.log('📝 Création d\'une nouvelle offre');
    console.log('📄 Body reçu:', JSON.stringify(req.body, null, 2));

    // Validation simple
    if (!req.body.titre || !req.body.prix) {
      return res.status(400).json({ 
        message: "Le titre et le prix sont requis" 
      });
    }

    const offre = new Offre({
      titre: req.body.titre,
      prix: req.body.prix
    });
    
    const savedOffre = await offre.save();
    console.log('✅ Offre créée:', JSON.stringify(savedOffre, null, 2));
    res.status(201).json(savedOffre);
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(400).json({ message: error.message });
  }
});

// Monter le routeur des offres AVANT les autres middlewares
router.use('/offres', offresRouter);

// Middleware de débogage pour les autres routes
router.use((req, res, next) => {
  if (!req.path.startsWith('/offres')) {
    console.log('🔍 Route appelée:', {
      method: req.method,
      path: req.path,
      params: req.params,
      query: req.query,
      body: req.body
    });
  }
  next();
});

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

// POST - Route pour lister les pèlerins (protégée)
router.post('/list', isAdmin, async (req, res) => {
  try {
    console.log('📋 Récupération de tous les pèlerins');
    console.log('👑 Accès administrateur:', req.body.email);
    const pelerins = await Pelerin.find().sort({ dateInscription: -1 });
    console.log('✅ Nombre de pèlerins trouvés:', pelerins.length);
    res.json(pelerins);
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Route pour obtenir les statistiques (protégée admin)
router.post('/stats', isAdmin, async (req, res) => {
  try {
    console.log('📊 Calcul des statistiques');
    console.log('👑 Accès administrateur:', req.body.email);

    // Statistiques par type de pèlerinage
    const hajjCount = await Pelerin.countDocuments({ typePelerinage: 'hajj' });
    const omraCount = await Pelerin.countDocuments({ typePelerinage: 'omra' });

    // Statistiques par civilité
    const hommesCount = await Pelerin.countDocuments({ civilite: 'M.' });
    const femmesCount = await Pelerin.countDocuments({ civilite: { $in: ['Mme', 'Mlle'] } });

    // Statistiques par ville
    const villes = await Pelerin.aggregate([
      { $group: { _id: '$adresse.ville', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Statistiques par type de chambre
    const chambres = await Pelerin.aggregate([
      { $group: { _id: '$chambre.type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const stats = {
      pelerinages: {
        hajj: hajjCount,
        omra: omraCount,
        total: hajjCount + omraCount
      },
      genre: {
        hommes: hommesCount,
        femmes: femmesCount,
        total: hommesCount + femmesCount
      },
      villes: villes.map(v => ({
        ville: v._id,
        nombre: v.count
      })),
      chambres: chambres.map(c => ({
        type: c._id || 'Non spécifié',
        nombre: c.count
      }))
    };

    console.log('✅ Statistiques calculées:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 