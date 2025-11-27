import { createContext, useContext, useEffect, useState } from "react";
import { loginUserInFirestore, registerUserInFirestore, getUserById } from "../services/userService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Inscription
    const signup = async (email, password, pseudo) => {
        const newUser = await registerUserInFirestore(email, password, pseudo);
        setUser(newUser);
        localStorage.setItem("userId", newUser.id); // Sauvegarde session
        return newUser;
    };

    // Connexion
    const login = async (email, password) => {
        const loggedUser = await loginUserInFirestore(email, password);
        setUser(loggedUser);
        localStorage.setItem("userId", loggedUser.id); // Sauvegarde session
        return loggedUser;
    };

    // Déconnexion
    const logout = () => {
        setUser(null);
        localStorage.removeItem("userId"); // Suppression session
    };

    // Au chargement de la page, on vérifie si on a un ID en mémoire
    useEffect(() => {
        const checkSession = async () => {
            const storedId = localStorage.getItem("userId");
            if (storedId) {
                const foundUser = await getUserById(storedId);
                if (foundUser) {
                    setUser(foundUser);
                } else {
                    localStorage.removeItem("userId"); // Nettoyage si user supprimé
                }
            }
            setLoading(false);
        };
        checkSession();
    }, []);

    const isAdmin = user?.isAdmin === true;

    return (
        <AuthContext.Provider value={{ user, isAdmin, signup, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};