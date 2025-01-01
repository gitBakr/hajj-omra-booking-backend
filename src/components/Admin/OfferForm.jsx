import React, { useState } from 'react';
import axios from 'axios';
import './OfferForm.css';

const OfferForm = () => {
  const [formData, setFormData] = useState({
    titre: '',
    prix: '',
    type: 'hajj'
  });
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://hajj-omra-booking-backend.onrender.com/offres',
        formData
      );
      setMessage({ type: 'success', text: 'Offre créée avec succès!' });
      setFormData({ titre: '', prix: '' }); // Reset form
      console.log('Nouvelle offre:', response.data);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Erreur lors de la création' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="offer-form-container">
      <h2>Ajouter une nouvelle offre</h2>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="offer-form">
        <div className="form-group">
          <label htmlFor="titre">Titre de l'offre</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            required
            placeholder="Ex: Hajj 2024 - Pack Premium"
          />
        </div>

        <div className="form-group">
          <label htmlFor="prix">Prix (€)</label>
          <input
            type="number"
            id="prix"
            name="prix"
            value={formData.prix}
            onChange={handleChange}
            required
            min="0"
            placeholder="Ex: 6500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="hajj">Hajj</option>
            <option value="omra">Omra</option>
          </select>
        </div>

        <button type="submit" className="submit-button">
          Créer l'offre
        </button>
      </form>
    </div>
  );
};

export default OfferForm; 