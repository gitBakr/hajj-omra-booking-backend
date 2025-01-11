const express = require('express');
const router = express.Router();
const Offre = require('../../models/Offre');
const { isAdmin } = require('../../middleware/auth');

// Routes publiques (lecture seule)
router.get('/', async (req, res) => {
    try {
        const offres = await Offre.find().sort({ dateCreation: -1 });
        console.log('📋 Liste offres:', offres.length);
        res.json(offres);
    } catch (error) {
        console.error('❌ Erreur liste offres:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const offre = await Offre.findOne({ id: req.params.id });
        if (!offre) {
            return res.status(404).json({ message: "Offre non trouvée" });
        }
        res.json(offre);
    } catch (error) {
        console.error('❌ Erreur détail offre:', error);
        res.status(500).json({ message: error.message });
    }
});

// Routes protégées (admin uniquement)
router.post('/', isAdmin, async (req, res) => {
    try {
        // Log complet des données reçues
        console.log('📦 Données complètes:', JSON.stringify(req.body, null, 2));
        
        const offreData = req.body.offre;
        
        // Log des champs requis
        console.log('🔍 Validation champs:', {
            titre: offreData?.titre,
            prix: offreData?.prix,
            type: offreData?.type,
            id: offreData?.id
        });

        // Vérification des champs requis
        if (!offreData?.titre || !offreData?.prix || !offreData?.type) {
            console.log('❌ Champs manquants');
            return res.status(400).json({ 
                message: "Le titre, le prix et le type sont requis",
                recu: {
                    titre: offreData?.titre,
                    prix: offreData?.prix,
                    type: offreData?.type
                }
            });
        }

        // Log avant création
        console.log('📝 Données à sauvegarder:', offreData);

        const offre = new Offre(offreData);
        const savedOffre = await offre.save();
        
        console.log('✅ Offre créée:', savedOffre);
        res.status(201).json(savedOffre);
    } catch (error) {
        console.error('❌ Erreur détaillée:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', isAdmin, async (req, res) => {
    try {
        const offreData = req.body.offre;
        const updatedOffre = await Offre.findOneAndUpdate(
            { id: req.params.id },
            offreData,
            { new: true }
        );
        if (!updatedOffre) {
            return res.status(404).json({ message: "Offre non trouvée" });
        }
        res.json(updatedOffre);
    } catch (error) {
        console.error('❌ Erreur mise à jour:', error);
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const deletedOffre = await Offre.findOneAndDelete({ id: req.params.id });
        if (!deletedOffre) {
            return res.status(404).json({ message: "Offre non trouvée" });
        }
        res.json({ message: "Offre supprimée avec succès" });
    } catch (error) {
        console.error('❌ Erreur suppression:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 