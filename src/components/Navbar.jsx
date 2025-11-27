import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">

                    {/* 1. LOGO MARQUE (Style Journal Financier) */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition">
                            <span className="text-3xl filter drop-shadow-sm">🐺</span>
                        </div>
                        <div className="flex flex-col">
              <span className="font-black text-2xl tracking-tighter text-gray-900 leading-none group-hover:text-primary transition">
                LE LOUP
              </span>
                            <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">
                Wall Street de la Creuse
              </span>
                        </div>
                    </Link>

                    {/* 2. SECTION DROITE (Actions Utilisateur) */}
                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                {/* Bouton Créer (Style "Ordre de Bourse") */}
                                <Link
                                    to="/create"
                                    className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-bold text-sm group"
                                >
                                    <span>✍️</span>
                                    <span>Publier une rumeur</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>

                                {/* Séparateur vertical */}
                                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                                {/* Profil Utilisateur */}
                                <div className="flex items-center gap-3 group relative">
                                    <Link to="/profile" className="flex items-center gap-3 group relative hover:bg-gray-50 p-2 rounded-full transition-colors">
                                        <div className="text-right hidden md:block">
                                            <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-primary transition">{user.pseudo}</p>
                                            <p className="text-xs text-green-600 font-medium">En ligne • Trader</p>
                                        </div>

                                        <div className="relative">
                                            <img
                                                src={user.avatar}
                                                alt="Avatar"
                                                className="w-10 h-10 rounded-full bg-gray-50 border-2 border-gray-100 group-hover:border-primary transition cursor-pointer object-cover"
                                            />
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                        </div>
                                    </Link>

                                    {/* Bouton Déco (Discret mais accessible) */}
                                    <button
                                        onClick={logout}
                                        className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                        title="Se déconnecter"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* 3. BOUTONS VISITEURS (Connexion / Inscription) */
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-primary font-bold text-sm px-4 py-2 rounded-full hover:bg-gray-50 transition"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                >
                                    Rejoindre le club
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;