const Pelerin = require('../models/Pelerin');

const adminController = {
    login: async (req, res) => {
        try {
            const { email } = req.body;
            
            if (email === process.env.ADMIN_EMAIL) {
                res.json({
                    success: true,
                    message: "Login réussi"
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: "Email non autorisé"
                });
            }
        } catch (error) {
            console.error('❌ Erreur login:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getPelerins: async (req, res) => {
        try {
            const pelerins = await Pelerin.find();
            res.json({
                success: true,
                data: pelerins
            });
        } catch (error) {
            console.error('❌ Erreur getPelerins:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

module.exports = adminController; 