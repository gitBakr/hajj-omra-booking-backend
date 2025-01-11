const isAdmin = async (req, res, next) => {
    try {
        console.log('🔐 Vérification admin:', {
            email: req.body.email,
            adminEmail: process.env.ADMIN_EMAIL
        });

        // Vérifier si l'email est fourni
        if (!req.body.email) {
            console.log('❌ Email manquant');
            return res.status(401).json({ message: "Email requis" });
        }

        // Vérifier si c'est l'admin
        if (req.body.email !== process.env.ADMIN_EMAIL) {
            console.log('❌ Email non autorisé');
            return res.status(403).json({ message: "Accès non autorisé" });
        }

        console.log('✅ Admin vérifié');
        next();
    } catch (error) {
        console.error('❌ Erreur auth:', error);
        res.status(500).json({ message: "Erreur d'authentification" });
    }
};

module.exports = { isAdmin }; 