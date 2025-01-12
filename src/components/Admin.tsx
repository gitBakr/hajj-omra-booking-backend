// Fonction de suppression
const handleDeleteOffer = async (offerId: string) => {
    try {
        console.log('Tentative de suppression de l\'offre:', offerId);
        
        const response = await fetch(`${API_URL}/offres/${offerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'raouanedev@gmail.com'
            })
        });

        if (response.ok) {
            setOffres(offres.filter(o => o._id !== offerId));
            console.log('✅ Offre supprimée avec succès');
        } else {
            console.error('❌ Erreur lors de la suppression:', await response.json());
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}; 