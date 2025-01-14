const isAdmin = (req, res, next) => {
    console.log('🔐 Vérification admin:', {
        body: req.body,
        email: req.body.email,
        envEmail: process.env.ADMIN_EMAIL
    });

    if (req.body.email === process.env.ADMIN_EMAIL) {
        next();
    } else {
        res.status(401).json({ message: "Non autorisé" });
    }
};

module.exports = { isAdmin }; 