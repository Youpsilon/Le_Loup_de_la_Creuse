import { useState } from 'react';
import { seedDatabase } from '../services/seederService';

function AdminSeed() {
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        if (!window.confirm("Attention, ça va injecter plein de données ! Sûr ?")) return;

        setLoading(true);
        setStatus("Génération en cours... Regarde la console pour les détails.");
        try {
            await seedDatabase();
            setStatus("✅ Terminé ! 20 Users et 40 Posts ajoutés.");
        } catch (e) {
            setStatus("❌ Erreur : " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md text-center mt-10">
            <h1 className="text-3xl font-bold text-red-600 mb-4">⚠️ Zone Danger ⚠️</h1>
            <p className="mb-6 text-gray-600">Utilisez ce bouton pour remplir la base de données avec des faux utilisateurs et des articles bidons.</p>

            <button
                onClick={handleSeed}
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-red-700 disabled:opacity-50"
            >
                {loading ? "Travail en cours..." : "Générer la Data 🚀"}
            </button>

            {status && <p className="mt-4 font-medium">{status}</p>}
        </div>
    );
}

export default AdminSeed;