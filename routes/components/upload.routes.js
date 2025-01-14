const express = require('express');
const router = express.Router();
const upload = require('../../services/uploadService');
const { isAdmin } = require('../../middleware/auth');

// Upload une image
router.post('/image', (req, res, next) => {
    console.log('📥 Requête reçue avant multer');
    console.log('📦 Headers:', req.headers);
    console.log('📝 Body:', req.body);
    next();
}, upload.single('image'), async (req, res) => {
    try {
        console.log('📤 Requête après multer');
        console.log('📄 Fichier:', req.file);
        if (!req.file) {
            return res.status(400).json({ message: 'Aucune image fournie' });
        }

        // Construire l'URL de l'image
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/hero/${req.file.filename}`;
        
        res.json({
            success: true,
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('❌ Erreur upload:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
