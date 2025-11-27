import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchLikedArticlesByUser, fetchArticlesByAuthor } from '../services/articleService'; // Nouvel import
import { formatDate } from '../utils/dateFormatter';

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [likedArticles, setLikedArticles] = useState([]);
    const [myArticles, setMyArticles] = useState([]); // État pour mes articles
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my_posts'); // État pour l'onglet actif

    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    useEffect(() => {
        const loadData = async () => {
            if (user?.id) {
                // On lance les deux requêtes en parallèle pour aller plus vite
                const [likesData, postsData] = await Promise.all([
                    fetchLikedArticlesByUser(user.id),
                    fetchArticlesByAuthor(user.id)
                ]);

                setLikedArticles(likesData);
                setMyArticles(postsData);
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    if (!user) return null;

    // Petite fonction helper pour afficher une grille d'articles (évite de dupliquer le code)
    const ArticleGrid = ({ articles, emptyMessage }) => {
        if (articles.length === 0) {
            return (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-xl text-gray-400 mb-4">{emptyMessage} 📉</p>
                    <Link to="/create" className="text-primary font-bold hover:underline">
                        Allez vite créer de la valeur !
                    </Link>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((post) => (
                    <Link key={post.id} to={`/article/${post.id}`} className="group">
                        <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                            <div className="relative h-40 overflow-hidden">
                                {post.imageUrl ? (
                                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-full shadow-sm text-gray-700">
                                    ❤️ {post.likes}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition">
                                    {post.title}
                                </h3>
                                <span className="text-xs text-gray-500 mt-auto block pt-4 border-t border-gray-50">
                  Publié le {formatDate(post.createdAt)}
                </span>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto pb-12">

            {/* EN-TÊTE PROFIL */}
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center gap-8 border border-gray-200">
                <div className="relative">
                    <img src={user.avatar} alt={user.pseudo} className="w-32 h-32 rounded-full border-4 border-gray-50 shadow-md" />
                    <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{user.pseudo}</h1>
                    <p className="text-gray-500 mb-6">Trader Agricole • Membre depuis le {formatDate(user.createdAt)}</p>

                    <button onClick={logout} className="px-6 py-2 border border-gray-300 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-50 hover:text-red-600 transition">
                        Se déconnecter
                    </button>
                </div>

                {/* Stats rapides */}
                <div className="flex gap-8 text-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                        <span className="block text-2xl font-bold text-primary">{myArticles.length}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Articles</span>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div>
                        <span className="block text-2xl font-bold text-red-500">{likedArticles.length}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Favoris</span>
                    </div>
                </div>
            </div>

            {/* ONGLETS DE NAVIGATION */}
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('my_posts')}
                    className={`pb-4 px-6 text-lg font-bold transition relative ${
                        activeTab === 'my_posts'
                            ? 'text-primary'
                            : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    ✍️ Mes Publications
                    {activeTab === 'my_posts' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full"></div>}
                </button>

                <button
                    onClick={() => setActiveTab('likes')}
                    className={`pb-4 px-6 text-lg font-bold transition relative ${
                        activeTab === 'likes'
                            ? 'text-red-500'
                            : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    ❤️ Mes Favoris
                    {activeTab === 'likes' && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded-t-full"></div>}
                </button>
            </div>

            {/* CONTENU */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    {activeTab === 'my_posts' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ArticleGrid articles={myArticles} emptyMessage="Vous n'avez rien publié." />
                        </div>
                    )}

                    {activeTab === 'likes' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <ArticleGrid articles={likedArticles} emptyMessage="Aucun coup de cœur." />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Profile;