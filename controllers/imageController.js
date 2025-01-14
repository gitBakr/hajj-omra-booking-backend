const Image = require('../models/Image');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }

    const image = new Image({
      filename: req.file.filename,
      path: req.file.path,
      description: req.body.description
    });

    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image non trouvée' });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image non trouvée' });
    }

    // Supprimer le fichier du système de fichiers
    fs.unlinkSync(path.join(uploadDir, image.filename));
    res.json({ message: 'Image supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
