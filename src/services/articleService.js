import { db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    doc,
    runTransaction,
    query,
    where,
    Timestamp
} from "firebase/firestore";

const ARTICLE_COLLECTION = "articles";

/**
 * Récupère tous les articles.
 */
export const fetchAllArticles = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, ARTICLE_COLLECTION));
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Erreur fetchAllArticles :", error);
        throw error;
    }
};

/**
 * Récupère un article spécifique par son ID.
 */
export const fetchArticleById = async (id) => {
    try {
        const docRef = doc(db, ARTICLE_COLLECTION, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Article introuvable");
        }
    } catch (error) {
        console.error("Erreur fetchArticleById :", error);
        throw error;
    }
};

/**
 * Crée un article avec l'ID de l'utilisateur connecté.
 */
export const createArticle = async (articleData, user) => {
    try {
        await addDoc(collection(db, ARTICLE_COLLECTION), {
            ...articleData,
            userId: user.id, // Important pour la suppression
            author: user.pseudo,
            likes: 0,
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("Erreur createArticle :", error);
        throw error;
    }
};

/**
 * Ajoute un like à un article.
 */
export const toggleLike = async (articleId, userId) => {
    const docRef = doc(db, ARTICLE_COLLECTION, articleId);

    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(docRef);
            if (!sfDoc.exists()) throw "Document n'existe pas !";

            const data = sfDoc.data();
            const likedBy = data.likedBy || []; // Tableau des ID des users qui ont liké
            const likes = data.likes || 0;

            if (likedBy.includes(userId)) {
                // L'utilisateur a déjà liké -> On enlève le like
                transaction.update(docRef, {
                    likes: likes - 1,
                    likedBy: likedBy.filter(id => id !== userId)
                });
            } else {
                // L'utilisateur n'a pas liké -> On ajoute le like
                transaction.update(docRef, {
                    likes: likes + 1,
                    likedBy: [...likedBy, userId]
                });
            }
        });
    } catch (e) {
        console.error("Erreur transaction like : ", e);
        throw e;
    }
};

/**
 * Supprime un article (C'est cette fonction qui te manquait !)
 */
export const deleteArticle = async (id) => {
    try {
        const docRef = doc(db, ARTICLE_COLLECTION, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Erreur deleteArticle :", error);
        throw error;
    }
};

/**
 * Récupère les articles likés par un utilisateur spécifique.
 */
export const fetchLikedArticlesByUser = async (userId) => {
    try {
        // On cherche les articles dont le tableau 'likedBy' contient l'ID du user
        const q = query(
            collection(db, ARTICLE_COLLECTION),
            where("likedBy", "array-contains", userId)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Erreur fetchLikedArticlesByUser :", error);
        return [];
    }
};

export const fetchArticlesByAuthor = async (userId) => {
    try {
        const q = query(
            collection(db, ARTICLE_COLLECTION),
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Erreur fetchArticlesByAuthor :", error);
        return [];
    }
};