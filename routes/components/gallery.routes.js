const express = require('express');
const router = express.Router();
const imageController = require('../../controllers/imageController');
const multer = require('multer');
const path = require('path');

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Routes CRUD pour la galerie
router.post('/', upload.single('image'), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier image fourni' });
  }
  next();
}, imageController.uploadImage);
router.get('/', imageController.getImages);
router.get('/:id', imageController.getImage);
router.delete('/:id', imageController.deleteImage);

module.exports = router;
