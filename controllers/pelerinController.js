exports.createPelerin = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      nationalite,
      telephone,
      email,
      adresse: { rue, numero, ville, codePostal },
      typePelerinage,
      besoinsSpeciaux
    } = req.body;

    // Vérifier si le pèlerin existe déjà
    const pelerinExistant = await Pelerin.findOne({ 
      nom: nom,
      prenom: prenom,
      email: email 
    });

    if (pelerinExistant) {
      return res.status(400).json({
        success: false,
        message: `Un(e) pèlerin(e) nommé(e) ${prenom} ${nom} avec l'email ${email} est déjà inscrit(e). ` +
                `Pour plus d'informations, appelez le 07 83 09 08 15 ou vérifiez vos réservations.`
      });
    }

    const pelerin = await Pelerin.create({
      nom,
      prenom,
      nationalite,
      telephone,
      email,
      adresse: {
        rue,
        numero,
        ville,
        codePostal
      },
      typePelerinage,
      besoinsSpeciaux
    });

    res.status(201).json({
      success: true,
      data: pelerin,
      message: 'Inscription réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la création:', error);
    res.status(400).json({
      success: false,
      message: error.code === 11000 
        ? `Une inscription existe déjà avec ces informations. Pour plus d'informations, appelez le 07 83 09 08 15.`
        : `Erreur lors de l'inscription. Veuillez réessayer.`
    });
  }
}; 