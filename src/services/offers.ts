export const updateOffer = async (offerId: string, offerData: any) => {
    try {
        const response = await fetch(`${API_URL}/offres/${offerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'raouanedev@gmail.com',
                offre: offerData
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erreur mise à jour offre:', error);
        throw error;
    }
}; 