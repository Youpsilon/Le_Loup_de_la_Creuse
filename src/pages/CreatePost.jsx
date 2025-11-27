import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../services/articleService';
import { useAuth } from '../context/AuthContext';

function CreatePost() {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Crypto-Tracteur',
        imageUrl: '' // Nouveau champ pour l'image
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fonction pour générer une image aléatoire si l'user a la flemme
    const handleRandomImage = () => {
        const randomId = Math.floor(Math.random() * 1000);
        setFormData({
            ...formData,
            imageUrl: `https://picsum.photos/seed/${randomId}/800/400`
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            await createArticle(formData, user);
            navigate('/');
        } catch (error) {
            alert("Erreur lors de la publication !");
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Partager un conseil ({user.pseudo})</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Titre */}
                <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Titre accrocheur</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Ex: Le cours de la betterave explose !"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Catégorie */}
                <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Catégorie</label>
                    <select
                        name="category"
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary outline-none"
                        onChange={handleChange}
                    >
                        <option value="Crypto-Tracteur">Crypto-Tracteur</option>
                        <option value="Immobilier Rural">Immobilier Rural</option>
                        <option value="Forex-Fermier">Forex Fermier</option>
                        <option value="NFT-Vache">NFT (Non-Fungible Truffade)</option>
                    </select>
                </div>

                {/* GESTION DE L'IMAGE */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-gray-700 mb-2 font-semibold">Image de couverture</label>

                    <div className="flex gap-2 mb-4">
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            placeholder="https://..."
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={handleRandomImage}
                            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm whitespace-nowrap transition"
                        >
                            🎲 Aléatoire
                        </button>
                    </div>

                    {/* Prévisualisation */}
                    {formData.imageUrl && (
                        <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-300">
                            <img
                                src={formData.imageUrl}
                                alt="Prévisualisation"
                                className="h-full w-full object-cover"
                                onError={(e) => e.target.src = "https://via.placeholder.com/800x400?text=Image+Invalide"}
                            />
                        </div>
                    )}
                </div>

                {/* Contenu */}
                <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Votre analyse d'expert</label>
                    <textarea
                        name="content"
                        rows="6"
                        placeholder="Expliquez pourquoi il faut investir maintenant..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg"
                >
                    🚀 Publier l'arnaque
                </button>
            </form>
        </div>
    );
}

export default CreatePost;