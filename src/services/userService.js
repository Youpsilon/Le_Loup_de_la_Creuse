import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc } from "firebase/firestore";

const USER_COLLECTION = "users";

/**
 * Inscription manuelle : Crée un document dans la collection 'users'
 */
export const registerUserInFirestore = async (email, password, pseudo) => {
    try {
        // 1. Vérifier si l'email existe déjà
        const q = query(collection(db, USER_COLLECTION), where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            throw new Error("Cet email est déjà utilisé par un autre investisseur !");
        }

        // 2. Créer l'utilisateur
        const newUser = {
            email,
            password, // Stocké en clair (Mode barbare activé)
            pseudo,
            isAdmin: false, // Par défaut
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${pseudo}`,
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, USER_COLLECTION), newUser);

        // On retourne l'utilisateur avec son ID Firestore
        return { id: docRef.id, ...newUser };
    } catch (error) {
        throw error;
    }
};

/**
 * Connexion manuelle : Cherche un user avec cet email et ce mot de passe
 */
export const loginUserInFirestore = async (email, password) => {
    try {
        const q = query(
            collection(db, USER_COLLECTION),
            where("email", "==", email),
            where("password", "==", password)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Email ou mot de passe incorrect.");
        }

        // On prend le premier résultat (il ne devrait y en avoir qu'un)
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
        throw error;
    }
};

/**
 * Récupérer un utilisateur par son ID (pour la reconnexion auto)
 */
export const getUserById = async (id) => {
    try {
        const docRef = doc(db, USER_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        return null;
    }
};