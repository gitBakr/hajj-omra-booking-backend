import React, { useState } from 'react';
import axios from 'axios';
import OffersList from './Offers/OffersList';
import './ReservationForm.css';

const ReservationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1 - Informations personnelles (obligatoires)
    civilite: '',
    nom: '',
    prenom: '',
    nationalite: '',
    telephone: '',
    email: '',
    typePelerinage: '',

    // Étape 2 - Informations complémentaires (optionnelles)
    adresse: {
      numero: '',
      rue: '',
      ville: '',
      codePostal: ''
    },
    besoinsSpeciaux: '',
    chambre: {
      type: 'quadruple',
      supplement: 0
    }
  });

  // Validation de l'étape 1
  const validateStep1 = () => {
    const requiredFields = ['civilite', 'nom', 'prenom', 'nationalite', 'telephone', 'email', 'typePelerinage'];
    return requiredFields.every(field => formData[field] && formData[field].trim() !== '');
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep1()) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    try {
        const response = await axios.post(
            'https://hajj-omra-booking-backend.onrender.com/pelerin',
            formData
        );
        
        console.log('Réservation créée:', response.data);
        alert('Réservation effectuée avec succès !');
        
        // Reset du formulaire
        setFormData({
            civilite: '',
            nom: '',
            prenom: '',
            nationalite: '',
            telephone: '',
            email: '',
            typePelerinage: '',
            adresse: {
                numero: '',
                rue: '',
                ville: '',
                codePostal: ''
            },
            besoinsSpeciaux: '',
            chambre: {
                type: 'quadruple',
                supplement: 0
            }
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        alert(error.response?.data?.message || 'Erreur lors de la réservation');
    }
  };

  return (
    <div className="reservation-form">
      <div className="steps-indicator">
        <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
          Étape 1: Informations personnelles
        </div>
        <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
          Étape 2: Informations complémentaires
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Informations personnelles</h2>
            
            <div className="form-group">
              <label>Civilité *</label>
              <select
                name="civilite"
                value={formData.civilite}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez</option>
                <option value="M.">M.</option>
                <option value="Mme">Mme</option>
                <option value="Mlle">Mlle</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nom *</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Prénom *</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Nationalité *</label>
              <input
                type="text"
                name="nationalite"
                value={formData.nationalite}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Téléphone *</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Type de Pèlerinage *</label>
              <select
                name="typePelerinage"
                value={formData.typePelerinage}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez</option>
                <option value="hajj">Hajj</option>
                <option value="omra">Omra</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleNext}
                disabled={!validateStep1()}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            {/* Étape 2 - Champs optionnels */}
            <button type="button" onClick={handlePrevious}>Précédent</button>
            <button type="submit">Réserver</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ReservationForm; 