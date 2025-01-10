const express = require('express');
const router = express.Router();
const Pelerin = require('../../models/Pelerin');
const { sendConfirmationEmail } = require('../../services/emailService');

// POST - Créer un nouveau pèlerin
router.post('/', async (req, res) => {
  try {
    console.log('📝 Données reçues:', JSON.stringify(req.body, null, 2));
    
    // Log configuration email
    console.log('📧 Configuration email:', {
      user: process.env.GMAIL_USER,
      hasPassword: !!process.env.GMAIL_APP_PASSWORD,
      mode: process.env.NODE_ENV
    });

    const existingPelerin = await Pelerin.findOne({ 
      $and: [
        { nom: req.body.nom },
        { prenom: req.body.prenom },
        { email: req.body.email }
      ]
    });
    
    if (existingPelerin) {
      return res.status(400).json({ 
        message: `Une réservation existe déjà pour ${req.body.prenom} ${req.body.nom} avec cet email.`
      });
    }

    const pelerin = new Pelerin(req.body);
    const savedPelerin = await pelerin.save();
    
    // Log données email
    console.log('📧 Données email:', {
      to: savedPelerin.email,
      type: savedPelerin.typePelerinage,
      offre: req.body.offreDetails
    });

    const emailResult = await sendConfirmationEmail({
      ...savedPelerin.toObject(),
      offreDetails: req.body.offreDetails
    });

    // Log résultat
    console.log('📧 Résultat envoi:', emailResult);

    res.status(201).json({
      pelerin: savedPelerin,
      emailSent: emailResult.success,
      emailError: emailResult.error
    });
  } catch (error) {
    console.error('❌ Erreur complète:', error);
    res.status(400).json({ message: error.message });
  }
});

// GET - Rechercher les réservations par email
router.get('/search', async (req, res) => {
  try {
    const { email } = req.query;
    console.log('🔍 Recherche pour email:', email);
    
    const reservations = await Pelerin.find({ email }).sort({ dateInscription: -1 });
    console.log('✅ Réservations trouvées:', reservations.length);
    
    res.json(reservations);
  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error);
    res.status(500).json({ message: error.message });
  }
});

// Ajouter cette nouvelle route
router.post('/send-email', async (req, res) => {
  try {
    const { to, subject, data } = req.body;
    
    const emailResult = await sendConfirmationEmail({
      civilite: "M.",
      nom: data.nom,
      prenom: "",
      email: to,
      typePelerinage: data.typePelerinage,
      dateDepart: data.dateDepart,
      chambre: {
        type: data.chambre
      }
    });

    if (emailResult.success) {
      res.json({ message: "Email envoyé avec succès" });
    } else {
      res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
    }
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    res.status(500).json({ message: error.message });
  }
});

// Ajouter cette nouvelle route pour tester nodemailer
router.post('/send-email-nodemailer', async (req, res) => {
  try {
    console.log('📥 POST /pelerin/send-email-nodemailer');
    console.log('📦 Données reçues:', req.body);
    
    const { to, subject, data } = req.body;
    const emailResult = await sendConfirmationEmail(data);

    if (emailResult.success) {
      res.json({ message: "Email envoyé avec succès" });
    } else {
      res.status(500).json({ message: "Erreur lors de l'envoi de l'email", error: emailResult.error });
    }
  } catch (error) {
    console.error('❌ Erreur route email:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 