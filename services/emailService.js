const nodemailer = require('nodemailer');

// Configuration simplifiée
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,  // true pour 465, false pour les autres ports
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Test la connexion
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Erreur SMTP:', error);
    } else {
        console.log('✅ Serveur SMTP prêt');
    }
});

const sendConfirmationEmail = async (reservationData) => {
    try {
        console.log('📧 Données reçues:', {
            type: reservationData.typePelerinage,
            offre: reservationData.offreDetails,
            email: reservationData.email
        });

        console.log('📧 Début envoi email...');
        console.log('📧 Mode:', process.env.NODE_ENV);
        console.log('📧 Destinataire:', reservationData.email);

        const mailOptions = {
            from: 'Hajj & Omra Booking <raouanedev@gmail.com>',
            to: reservationData.email,
            subject: `Confirmation de réservation - ${reservationData.typePelerinage.toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #2c3e50;">Confirmation de réservation - ${reservationData.typePelerinage}</h1>
                    <p>Bonjour ${reservationData.civilite} ${reservationData.nom} ${reservationData.prenom},</p>
                    
                    <p>Nous avons bien reçu votre inscription pour le voyage suivant :</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin: 10px 0;"><strong>Type :</strong> ${reservationData.typePelerinage}</li>
                        <li style="margin: 10px 0;"><strong>Offre :</strong> ${reservationData.offreDetails?.titre || 'Non spécifié'}</li>
                        <li style="margin: 10px 0;"><strong>Prix indicatif :</strong> ${reservationData.offreDetails?.prix || 'Non spécifié'}€</li>
                        <li style="margin: 10px 0;"><strong>Durée :</strong> ${reservationData.offreDetails?.duree || 'Non spécifié'}</li>
                        <li style="margin: 10px 0;"><strong>Départ prévu :</strong> ${reservationData.offreDetails?.dateDepart || 'Non spécifié'}</li>
                    </ul>

                    <p style="margin-top: 20px;">Un conseiller vous contactera prochainement pour finaliser votre réservation.</p>
                    
                    <div style="margin-top: 30px;">
                        <p>Cordialement,<br>
                        L'équipe Hajj & Omra</p>
                    </div>
                </div>
            `
        };

        console.log('📧 Configuration:', {
            mode: process.env.NODE_ENV,
            user: process.env.GMAIL_USER,
            hasPassword: !!process.env.GMAIL_APP_PASSWORD
        });

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email envoyé:', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('❌ Erreur détaillée:', {
            message: error.message,
            code: error.code,
            response: error.response
        });
        return { success: false, error: error.message };
    }
};

module.exports = { sendConfirmationEmail }; 