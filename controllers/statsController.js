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
    },

    getStatsByGender: async (req, res) => {
        console.log('📊 Requête stats genre reçue');
        try {
            const stats = await Pelerin.aggregate([
                {
                    $match: {
                        genre: { $exists: true, $ne: null }
                    }
                },
                {
                    $group: {
                        _id: "$genre",
                        count: { $sum: 1 },
                        age_moyen: { 
                            $avg: { 
                                $cond: [
                                    { $ne: ["$age", null] },
                                    "$age",
                                    0
                                ]
                            } 
                        },
                        par_type: {
                            $push: { 
                                $cond: [
                                    { $ne: ["$typePelerinage", null] },
                                    "$typePelerinage",
                                    "Non défini"
                                ]
                            }
                        }
                    }
                }
            ]);

            const formattedStats = stats.reduce((acc, curr) => {
                if (curr._id) {
                    acc[curr._id.toLowerCase()] = {
                        total: curr.count,
                        age_moyen: Math.round(curr.age_moyen) || 0,
                        repartition: {
                            hajj: curr.par_type.filter(t => t === 'Hajj').length,
                            omra: curr.par_type.filter(t => t === 'Omra').length,
                            non_defini: curr.par_type.filter(t => t === 'Non défini').length
                        }
                    };
                }
                return acc;
            }, {});

            const total = {
                total_general: stats.reduce((sum, curr) => sum + curr.count, 0),
                age_moyen_general: Math.round(
                    stats.reduce((sum, curr) => sum + (curr.age_moyen * curr.count), 0) / 
                    stats.reduce((sum, curr) => sum + curr.count, 0)
                ) || 0
            };

            console.log('📊 Stats genre formatées:', { ...formattedStats, ...total });
            res.json({ ...formattedStats, ...total });
        } catch (error) {
            console.error('❌ Erreur stats genre:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    }
};

module.exports = statsController; 