import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllArticles } from '../services/articleService';
import { formatDate } from '../utils/dateFormatter';

function Home() {
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // État pour les cours de la bourse agricole
    const [marketData, setMarketData] = useState([
        { symbol: "FOIN", price: 120.50, change: 12.5 },
        { symbol: "LAIT", price: 0.95, change: -3.2 },
        { symbol: "TRACTEUR", price: 45000, change: 0.05 },
        { symbol: "BETTERAVE", price: 4.20, change: 42.0 },
        { symbol: "OEUF (CAC40)", price: 0.30, change: 0.0 },
        { symbol: "FUMIER COIN", price: 0.0001, change: -99.9 },
    ]);

    // Effet pour faire bouger les cours toutes les 2 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setMarketData(currentData =>
                currentData.map(item => {
                    // Variation aléatoire entre -5% et +5%
                    const variation = (Math.random() * 10) - 5;
                    const newPrice = Math.max(0.01, item.price * (1 + variation / 100));
                    return {
                        ...item,
                        price: newPrice,
                        change: variation // La variation devient le nouveau % affiché
                    };
                })
            );
        }, 2000); // Mise à jour toutes les 2 secondes

        return () => clearInterval(interval);
    }, []);

    // Chargement des articles
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchAllArticles();
                setArticles(data);
            } catch (error) {
                console.error("Erreur chargement", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">

            {/* 1. BANDEAU BOURSIER DYNAMIQUE */}
            <div className="bg-gray-900 text-white text-xs py-3 overflow-hidden shadow-lg relative z-10">
                <div className="whitespace-nowrap animate-marquee flex gap-8 items-center font-mono">
                    {/* On double la liste pour l'effet de défilement infini fluide */}
                    {[...marketData, ...marketData].map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <span className="font-bold text-gray-400">{item.symbol}</span>
                            <span>{item.price.toFixed(2)} €</span>
                            <span className={item.change >= 0 ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change).toFixed(2)}%
              </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. HERO SECTION */}
            <div className="bg-white border-b border-gray-200 py-16 px-4 mb-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        L'actualité financière <span className="text-primary">rurale</span>
                    </h1>
                    <p className="text-xl text-gray-500 mb-8">
                        Analyses de pointe sur le marché de la paille et les crypto-vaches.
                    </p>

                    <div className="relative max-w-lg mx-auto">
                        <input
                            type="text"
                            placeholder="Rechercher une opportunité (ex: Fumier 2.0)..."
                            className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-100 shadow-lg focus:border-primary focus:ring-2 focus:ring-blue-100 outline-none transition text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="absolute left-4 top-4 text-2xl">🔍</span>
                    </div>
                </div>
            </div>

            {/* 3. CONTENU PRINCIPAL */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {!loading && filteredArticles.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-400">Aucun investissement trouvé pour "{searchTerm}" 📉</p>
                    </div>
                )}

                {/* GRILLE D'ARTICLES */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArticles.map((post) => (
                        <Link key={post.id} to={`/article/${post.id}`} className="group">
                            <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col border border-gray-100">

                                <div className="relative h-56 overflow-hidden">
                                    {post.imageUrl ? (
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-200 flex items-center justify-center text-gray-400">
                                            Pas d'image
                                        </div>
                                    )}

                                    <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {post.category || "Analyse"}
                    </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition line-clamp-2">
                                        {post.title}
                                    </h2>

                                    <p className="text-gray-600 text-sm line-clamp-3 flex-1 mb-4">
                                        {post.content}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-xs">
                                                {post.author ? post.author.charAt(0).toUpperCase() : "?"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                <span className="block font-semibold text-gray-800">{post.author}</span>
                                                <span>{formatDate(post.createdAt)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-red-500 font-medium text-sm bg-red-50 px-2 py-1 rounded-md">
                                            ❤️ {post.likes}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;