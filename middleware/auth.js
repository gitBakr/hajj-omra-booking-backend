const isAdmin = async (req, res, next) => {
    try {
        // Log détaillé pour le debug
        console.log('🔍 Debug Auth:', {
            receivedEmail: req.body.email,
            envEmail: process.env.ADMIN_EMAIL,
            envExists: !!process.env.ADMIN_EMAIL,
            emailMatch: req.body.email === process.env.ADMIN_EMAIL
        });

        if (!req.body.email) {
            return res.status(401).json({ message: "Email requis" });
        }

        if (req.body.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ 
                success: false,
                message: "Accès non autorisé",
                debug: {
                    received: req.body.email,
                    expected: process.env.ADMIN_EMAIL
                }
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { isAdmin }; 