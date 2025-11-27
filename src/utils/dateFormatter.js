/**
 * Formate un Timestamp Firestore ou une date JS en chaîne lisible.
 * @param {Object} timestamp - L'objet Timestamp de Firestore (ou null).
 * @returns {string} - La date formatée (ex: "24/11/2023").
 */
export const formatDate = (timestamp) => {
    if (!timestamp) return "Date inconnue";

    // Si c'est un Timestamp Firebase, on le convertit en Date JS
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};