const express = require('express');
const router = express.Router();
const Offre = require('../../models/Offre');

// Middleware d'authentification admin
const isAdmin = (req, res, next) => {
  const { email } = req.body;
  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Accès non autorisé" });
  }
  next();
};

// GET - Liste des offres (public)
router.get('/', async (req, res) => {
  try {
    console.log('Liste des offres');
    const offres = await Offre.find().sort({ dateCreation: -1 });
    console.log('Nombre d\'offres trouvees:', offres.length);
    res.json(offres);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Creer une nouvelle offre (admin seulement)
router.post('/', isAdmin, async (req, res) => {
  try {
    console.log('Creation d\'une nouvelle offre');
    console.log('Body recu:', JSON.stringify(req.body, null, 2));

    // Validation
    if (!req.body.titre || !req.body.prix || !req.body.type) {
      return res.status(400).json({ 
        message: "Le titre, le prix et le type sont requis" 
      });
    }

    // Validation du type
    if (!['hajj', 'omra'].includes(req.body.type)) {
      return res.status(400).json({ 
        message: "Le type doit être 'hajj' ou 'omra'" 
      });
    }

    const offre = new Offre({
      titre: req.body.titre,
      prix: req.body.prix,
      type: req.body.type
    });
    
    const savedOffre = await offre.save();
    console.log('Offre creee:', JSON.stringify(savedOffre, null, 2));
    res.status(201).json(savedOffre);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT - Modifier une offre (admin seulement)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    console.log('Modification de l\'offre:', req.params.id);
    console.log('Body recu:', JSON.stringify(req.body, null, 2));

    const offre = await Offre.findById(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvee" });
    }

    if (req.body.titre) offre.titre = req.body.titre;
    if (req.body.prix) offre.prix = req.body.prix;
    if (req.body.type) offre.type = req.body.type;

    const updatedOffre = await offre.save();
    console.log('Offre modifiee:', JSON.stringify(updatedOffre, null, 2));
    res.json(updatedOffre);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer une offre (admin seulement)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    console.log('Suppression de l\'offre:', req.params.id);

    const offre = await Offre.findById(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvee" });
    }

    await Offre.findByIdAndDelete(req.params.id);
    console.log('Offre supprimee avec succes');
    res.json({ message: "Offre supprimee avec succes" });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 