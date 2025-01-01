import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OffersList.css';

const OffersList = ({ onSelectOffer }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('https://hajj-omra-booking-backend.onrender.com/offres');
        setOffers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer._id);
    onSelectOffer(offer);
  };

  if (loading) return <div className="offers-loading">Chargement des offres...</div>;
  if (error) return <div className="offers-error">Erreur: {error}</div>;

  return (
    <div className="offers-container">
      <h2>Choisissez votre formule</h2>
      <div className="offers-grid">
        {offers.map(offer => (
          <div 
            key={offer._id} 
            className={`offer-card ${selectedOffer === offer._id ? 'selected' : ''}`}
            onClick={() => handleSelectOffer(offer)}
          >
            <div className="offer-header">
              <h3>{offer.titre}</h3>
              <div className="offer-price">{offer.prix} €</div>
            </div>
            <div className="offer-content">
              <ul>
                <li>Transport inclus</li>
                <li>Hébergement en hôtel</li>
                <li>Guide accompagnateur</li>
                <li>Visa inclus</li>
              </ul>
            </div>
            <button 
              className={`select-button ${selectedOffer === offer._id ? 'selected' : ''}`}
            >
              {selectedOffer === offer._id ? 'Sélectionné' : 'Choisir'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersList; 