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
        console.log('📧 Début envoi email...');
        console.log('📧 Mode:', process.env.NODE_ENV);
        console.log('📧 Destinataire:', reservationData.email);

        const mailOptions = {
            from: 'Hajj & Omra Booking <raouanedev@gmail.com>',
            to: reservationData.email,
            subject: `Confirmation de réservation - ${reservationData.typePelerinage.toUpperCase()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #2c3e50;">Confirmation de Réservation</h1>
                        <p style="color: #7f8c8d;">Numéro de réservation : ${reservationData._id}</p>
                    </div>

                    <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                        <p>Cher/Chère ${reservationData.civilite} ${reservationData.nom} ${reservationData.prenom},</p>
                        <p>Nous avons le plaisir de confirmer votre réservation pour le pèlerinage suivant :</p>
                    </div>

                    <div style="background: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                        <h2 style="color: #2c3e50; font-size: 18px;">Détails de votre voyage</h2>
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin: 10px 0;">
                                <strong>Type de pèlerinage :</strong> ${reservationData.typePelerinage.toUpperCase()}
                            </li>
                            <li style="margin: 10px 0;">
                                <strong>Date de départ :</strong> ${reservationData.dateDepart}
                            </li>
                            <li style="margin: 10px 0;">
                                <strong>Type de chambre :</strong> ${reservationData.chambre.type}
                            </li>
                            ${reservationData.besoinsSpeciaux ? `
                            <li style="margin: 10px 0;">
                                <strong>Besoins spéciaux :</strong> ${reservationData.besoinsSpeciaux}
                            </li>
                            ` : ''}
                        </ul>
                    </div>

                    <div style="margin-top: 30px; padding: 20px; background: #f5f6fa; border-radius: 5px;">
                        <p><strong>Prochaines étapes :</strong></p>
                        <ol style="margin-left: 20px;">
                            <li>Notre équipe vous contactera sous 24-48h</li>
                            <li>Préparez vos documents de voyage</li>
                            <li>Attendez notre confirmation pour le paiement</li>
                        </ol>
                    </div>

                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                        <p style="color: #7f8c8d;">Pour toute question, contactez-nous :</p>
                        <p style="margin: 5px 0;">📞 +33 6 12 34 56 78</p>
                        <p style="margin: 5px 0;">✉️ contact@hajj-omra-booking.com</p>
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