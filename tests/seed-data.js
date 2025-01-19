const Pelerin = require('../models/Pelerin');
const mongoose = require('mongoose');

const pelerinsTest = [
    {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@test.com",
        telephone: "+33612345678",
        civilite: "M.",
        nationalite: "Française",
        genre: "homme",
        age: 45,
        typePelerinage: "hajj",
        chambre: { 
            type: "double",
            supplement: 200
        },
        prix: 7000,
        dateInscription: new Date(),
        adresse: {
            numero: "12",
            rue: "Rue de la Paix",
            ville: "Paris",
            codePostal: "75001"
        }
    },
    {
        nom: "Martin",
        prenom: "Marie",
        email: "marie.martin@test.com",
        telephone: "+33623456789",
        civilite: "Mme",
        nationalite: "Française",
        genre: "femme",
        age: 38,
        typePelerinage: "omra",
        chambre: { 
            type: "triple",
            supplement: 100
        },
        prix: 3000,
        dateInscription: new Date(),
        adresse: {
            numero: "45",
            rue: "Avenue des Champs-Élysées",
            ville: "Paris",
            codePostal: "75008"
        }
    },
    {
        nom: "Bernard",
        prenom: "Paul",
        email: "paul.bernard@test.com",
        telephone: "+33634567890",
        civilite: "M.",
        nationalite: "Française",
        genre: "homme",
        age: 52,
        typePelerinage: "hajj",
        chambre: { 
            type: "quadruple",
            supplement: 0
        },
        prix: 6500,
        dateInscription: new Date(),
        adresse: {
            numero: "8",
            rue: "Boulevard Haussmann",
            ville: "Paris",
            codePostal: "75009"
        }
    },
    {
        nom: "Petit",
        prenom: "Sophie",
        email: "sophie.petit@test.com",
        telephone: "+33645678901",
        civilite: "Mlle",
        nationalite: "Française",
        genre: "femme",
        age: 41,
        typePelerinage: "omra",
        chambre: { 
            type: "double",
            supplement: 200
        },
        prix: 3200,
        dateInscription: new Date(),
        adresse: {
            numero: "23",
            rue: "Rue du Commerce",
            ville: "Paris",
            codePostal: "75015"
        }
    }
];

async function seedDatabase() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        // Nettoyage de la base avant insertion
        await Pelerin.deleteMany({});
        console.log('🧹 Base de données nettoyée');

        // Ajout des données de test
        await Pelerin.insertMany(pelerinsTest);
        console.log('✅ Données de test ajoutées');

        const count = await Pelerin.countDocuments();
        console.log(`📊 Nombre total de pèlerins: ${count}`);

        // Afficher quelques statistiques
        const stats = await Pelerin.aggregate([
            {
                $group: {
                    _id: "$genre",
                    count: { $sum: 1 },
                    age_moyen: { $avg: "$age" }
                }
            }
        ]);
        console.log('📊 Statistiques par genre:', 
            stats.map(s => ({
                genre: s._id,
                nombre: s.count,
                age_moyen: Math.round(s.age_moyen)
            }))
        );

    } catch (error) {
        console.error('❌ Erreur:', error);
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                console.error(`- ${key}:`, error.errors[key].message);
            });
        }
    } finally {
        await mongoose.disconnect();
        console.log('👋 Déconnecté de MongoDB');
    }
}

// Exécuter le script
require('dotenv').config();
seedDatabase(); 