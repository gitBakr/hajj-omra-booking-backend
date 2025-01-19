const isAdmin = (req, res, next) => {
    console.log('🔐 Vérification admin:', {
        method: req.method,
        path: req.path,
        body: req.body,
        email: req.body.email,
        adminEmail: process.env.ADMIN_EMAIL
    });

    if (!req.body.email) {
        return res.status(400).json({ 
            success: false,
            message: "Email requis" 
        });
    }

    if (req.body.email === process.env.ADMIN_EMAIL) {
        next();
    } else {
        res.status(401).json({ 
            success: false,
            message: "Non autorisé" 
        });
    }
};

module.exports = { isAdmin }; 