const express = require('express');
const router = express.Router();
const Hero = require('../../models/Hero');
const { isAdmin } = require('../../middleware/auth');

// Debug logs
console.log('🔄 Initialisation des routes hero');

// Routes
router.get('/', async (req, res) => {
    console.log('📥 GET /hero');
    try {
        const hero = await Hero.findOne();
        res.json(hero);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', isAdmin, async (req, res) => {
    console.log('📥 POST /hero');
    try {
        const hero = new Hero(req.body.hero);
        const savedHero = await hero.save();
        res.status(201).json(savedHero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT - Modifier le hero
router.put('/', isAdmin, async (req, res) => {
    console.log('📥 PUT /hero');
    try {
        const hero = await Hero.findOne();
        if (!hero) {
            return res.status(404).json({ message: "Hero non trouvé" });
        }

        Object.assign(hero, req.body.hero);
        const updatedHero = await hero.save();
        res.json(updatedHero);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - Supprimer le hero
router.delete('/', isAdmin, async (req, res) => {
    console.log('📥 DELETE /hero');
    try {
        const hero = await Hero.findOne();
        if (!hero) {
            return res.status(404).json({ message: "Hero non trouvé" });
        }

        await Hero.deleteOne({ _id: hero._id });
        res.json({ 
            success: true,
            message: "Hero supprimé avec succès",
            data: hero
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Debug - Liste des routes
console.log('📍 Routes hero configurées:', 
    router.stack
        .filter(r => r.route)
        .map(r => `${Object.keys(r.route.methods)} ${r.route.path}`)
);

module.exports = router; 