const Pelerin = require('../models/Pelerin');

const statsController = {
    getStatsByType: async (req, res) => {
        console.log('📊 Requête stats reçue:', req.body);
        try {
            const stats = await Pelerin.aggregate([
                {
                    $group: {
                        _id: "$typePelerinage",
                        count: { $sum: 1 },
                        revenue: { $sum: "$prix" },
                        averagePrice: { $avg: "$prix" },
                        rooms: { $push: "$chambre.type" }
                    }
                }
            ]);

            const formattedStats = stats.reduce((acc, curr) => {
                acc[curr._id.toLowerCase()] = {
                    count: curr.count,
                    revenue: curr.revenue,
                    averagePrice: Math.round(curr.averagePrice),
                    rooms: {
                        double: curr.rooms.filter(r => r === 'double').length,
                        triple: curr.rooms.filter(r => r === 'triple').length,
                        quadruple: curr.rooms.filter(r => r === 'quadruple').length
                    }
                };
                return acc;
            }, {});

            console.log('📊 Stats formatées:', formattedStats);
            res.json(formattedStats);
        } catch (error) {
            console.error('❌ Erreur:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }
};

module.exports = statsController; 