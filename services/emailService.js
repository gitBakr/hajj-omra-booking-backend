const nodemailer = require('nodemailer');

// Configuration selon l'environnement
const transporter = process.env.NODE_ENV === 'production'
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD  // Mot de passe d'application
        }
    })
    : nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "f2d7d53f28c969",
            pass: "242dbaccf5e236"
        }
    });

const sendConfirmationEmail = async (reservationData) => {
    try {
        const mailOptions = {
            from: 'Hajj & Omra Booking <raouanedev@gmail.com>',
            to: reservationData.email,
            subject: 'Confirmation de votre réservation',
            html: `
                <h2>Confirmation de réservation</h2>
                <p>Cher/Chère ${reservationData.civilite} ${reservationData.nom} ${reservationData.prenom},</p>
                <p>Nous avons bien reçu votre réservation. Voici les détails :</p>
                <ul>
                    <li>Numéro de réservation : ${reservationData._id}</li>
                    <li>Type de pèlerinage : ${reservationData.typePelerinage}</li>
                    <li>Date de départ : ${reservationData.dateDepart}</li>
                    <li>Type de chambre : ${reservationData.chambre.type}</li>
                </ul>
                <p>Notre équipe vous contactera prochainement pour finaliser les détails.</p>
                <p>Cordialement,<br>L'équipe Hajj & Omra Booking</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email envoyé:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendConfirmationEmail }; 