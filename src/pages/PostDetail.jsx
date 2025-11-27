import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchArticleById, toggleLike, deleteArticle } from '../services/articleService';
import { fetchCommentsByArticleId, addComment } from '../services/commentService';
import { formatDate } from '../utils/dateFormatter';
import { useAuth } from '../context/AuthContext';

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ text: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const articleData = await fetchArticleById(id);
                setArticle(articleData);
                const commentsData = await fetchCommentsByArticleId(id);
                setComments(commentsData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleLike = async () => {
        if (!user) return alert("Il faut montrer patte blanche pour voter (connecte-toi) !");

        const isLiked = article.likedBy?.includes(user.id);

        setArticle(prev => ({
            ...prev,
            likes: isLiked ? prev.likes - 1 : prev.likes + 1,
            likedBy: isLiked
                ? prev.likedBy.filter(id => id !== user.id)
                : [...(prev.likedBy || []), user.id]
        }));

        await toggleLike(id, user.id);
    };

    const handleDelete = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir étouffer cette affaire ?")) {
            await deleteArticle(id);
            navigate('/');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert("Connecte-toi pour débattre !");
        if (!newComment.text) return;

        // MODIF : On passe user.avatar à la fonction
        await addComment(id, user.pseudo, user.avatar, newComment.text);

        const updatedComments = await fetchCommentsByArticleId(id);
        setComments(updatedComments);
        setNewComment({ text: '' });
    };

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!article) return <div className="text-center p-20 text-2xl font-bold text-gray-400">Article classé secret défense (introuvable).</div>;

    const canDelete = user && (user.id === article.userId || isAdmin);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">

            <div className="max-w-4xl mx-auto px-4 pt-8 pb-4">
                <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition">
                    ← Retour au marché
                </Link>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <header className="text-center mb-10">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
            {article.category}
          </span>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-center space-x-4 text-gray-600">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                                {article.author ? article.author.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-gray-900">{article.author}</p>
                                <p className="text-xs text-gray-500">{formatDate(article.createdAt)}</p>
                            </div>
                        </div>

                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                className="ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                title="Supprimer cet article"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                </header>

                {article.imageUrl && (
                    <div className="mb-12 relative group rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-[400px] md:h-[500px] object-cover transform group-hover:scale-105 transition duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
                    </div>
                )}

                <div className="max-w-2xl mx-auto">
                    <div className="prose prose-lg prose-slate text-gray-700 leading-relaxed whitespace-pre-wrap first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-[-10px]">
                        {article.content}
                    </div>

                    {/* MODIF : On a supprimé le bouton "Partager" ici, il ne reste que le Like */}
                    <div className="mt-12 pt-8 border-t border-gray-200 flex justify-center">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-3 px-8 py-3 rounded-full transition-all duration-300 shadow-md transform hover:-translate-y-1 ${
                                article.likedBy?.includes(user?.id)
                                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-red-200 scale-105"
                                    : "bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-500"
                            }`}
                        >
                            <span className="text-2xl">{article.likedBy?.includes(user?.id) ? "❤️" : "🤍"}</span>
                            <div className="flex flex-col items-start leading-none">
                                <span className="font-bold text-lg">{article.likes || 0}</span>
                                <span className="text-xs opacity-80 font-normal">Investisseurs</span>
                            </div>
                        </button>
                    </div>

                    <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                            💬 L'avis des experts <span className="text-gray-400 text-lg font-normal">({comments.length})</span>
                        </h3>

                        {user ? (
                            <form onSubmit={handleCommentSubmit} className="mb-10 flex gap-4 items-start">
                                <img src={user.avatar} alt="Moi" className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 hidden sm:block" />
                                <div className="flex-1 relative">
                  <textarea
                      placeholder="Ajouter votre analyse contradictoire..."
                      className="w-full p-4 pr-12 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition resize-none text-gray-700 min-h-[100px]"
                      value={newComment.text}
                      onChange={(e) => setNewComment({ text: e.target.value })}
                      required
                  />
                                    <button
                                        type="submit"
                                        className="absolute bottom-3 right-3 bg-primary text-white p-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                                        title="Envoyer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-blue-50 p-6 rounded-xl text-center mb-10 border border-blue-100">
                                <p className="text-blue-800 font-medium">Envie de contredire cet article ?</p>
                                <Link to="/login" className="mt-2 inline-block text-primary font-bold hover:underline">Connectez-vous pour commenter</Link>
                            </div>
                        )}

                        <div className="space-y-8">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex-shrink-0">
                                        {/* MODIF : Affichage de l'avatar si dispo, sinon fallback sur la lettre */}
                                        {comment.avatar ? (
                                            <img
                                                src={comment.avatar}
                                                alt={comment.user}
                                                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 border border-gray-200">
                                                {comment.user ? comment.user.charAt(0).toUpperCase() : "?"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 group-hover:border-gray-200 transition">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-gray-900">{comment.user}</span>
                                                <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                                            </div>
                                            <p className="text-gray-700 leading-relaxed text-sm">{comment.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {comments.length === 0 && (
                                <p className="text-center text-gray-400 italic py-4">Soyez le premier à dénoncer cette arnaque...</p>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}

export default PostDetail;