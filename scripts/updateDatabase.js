const mongoose = require('mongoose');
const Pelerin = require('../models/Pelerin');
require('dotenv').config();

const updateDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hajj_db');
    
    // Mettre à jour toutes les réservations existantes
    const result = await Pelerin.updateMany(
      { chambre: { $exists: false } },
      { 
        $set: { 
          chambre: {
            type: 'quadruple',
            supplement: 0
          }
        } 
      }
    );

    console.log(`✅ Base de données mise à jour. ${result.modifiedCount} documents modifiés.`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
  } finally {
    await mongoose.disconnect();
  }
};

updateDatabase(); 