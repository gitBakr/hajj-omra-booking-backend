const express = require('express');
const router = express.Router();
const Offre = require('../../models/Offre');

// GET - Liste des offres
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

// POST - Creer une nouvelle offre
router.post('/', async (req, res) => {
  try {
    console.log('Creation d\'une nouvelle offre');
    console.log('Body recu:', JSON.stringify(req.body, null, 2));

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
    console.log('Offre creee:', JSON.stringify(savedOffre, null, 2));
    res.status(201).json(savedOffre);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(400).json({ message: error.message });
  }
});

// PUT - Modifier une offre
router.put('/:id', async (req, res) => {
  try {
    console.log('Modification de l\'offre:', req.params.id);
    console.log('Body recu:', JSON.stringify(req.body, null, 2));

    // Verifier si l'offre existe
    const offre = await Offre.findById(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvee" });
    }

    // Mettre a jour les champs modifiables
    if (req.body.titre) offre.titre = req.body.titre;
    if (req.body.prix) offre.prix = req.body.prix;

    // Sauvegarder les modifications
    const updatedOffre = await offre.save();
    console.log('Offre modifiee:', JSON.stringify(updatedOffre, null, 2));
    res.json(updatedOffre);
  } catch (error) {
    console.error('Erreur:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer une offre
router.delete('/:id', async (req, res) => {
  try {
    console.log('Suppression de l\'offre:', req.params.id);

    // Verifier si l'offre existe
    const offre = await Offre.findById(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: "Offre non trouvee" });
    }

    // Supprimer l'offre
    await Offre.findByIdAndDelete(req.params.id);
    console.log('Offre supprimee avec succes');
    res.json({ message: "Offre supprimee avec succes" });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 