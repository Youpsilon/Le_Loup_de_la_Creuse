import { db } from "./firebase";
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";


const COMMENT_COLLECTION = "comments";

/**
 * Récupère les commentaires liés à un article spécifique.
 * @param {string} articleId - L'ID de l'article.
 */
export const fetchCommentsByArticleId = async (articleId) => {
    try {
        // Requête : On cherche dans "comments" où "articleId" correspond à notre article
        // On trie par date de création (du plus récent au plus vieux)
        const q = query(
            collection(db, COMMENT_COLLECTION),
            where("articleId", "==", articleId),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        // Note : Si tu as une erreur "index", regarde la console du navigateur, Firestore te donnera un lien pour le créer automatiquement.
        console.error("Erreur lors de la récupération des commentaires :", error);
        return [];
    }
};

/**
 * Ajoute un commentaire.
 * @param {string} articleId
 * @param {string} user
 * @param {string} text
 */
export const addComment = async (articleId, user, avatar, text) => {
    try {
        await addDoc(collection(db, COMMENT_COLLECTION), {
            articleId,
            user,   // Le pseudo
            avatar, // L'URL de l'avatar
            text,
            createdAt: Timestamp.now()
        });
    } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire :", error);
        throw error;
    }
};