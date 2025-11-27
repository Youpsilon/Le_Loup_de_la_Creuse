import { db } from "./firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Listes de données fake pour le fun
const PSEUDOS = ["CryptoKing", "TracteurFan", "JeanMichelYield", "BourseMan", "WolfOfCreuse", "KarenCoin", "ElonMuskDeLaCreuse", "AgriStonks", "PailleTrader", "FoinHolder"];
const CATEGORIES = ["Crypto-Tracteur", "Immobilier Rural", "Forex-Fermier", "NFT-Vache"];
const TITLES = [
    "Pourquoi la paille est le nouvel or",
    "J'ai miné du Bitcoin avec mon tracteur",
    "Top 10 des granges à rénover pour devenir riche",
    "Alerte : Le cours de la betterave s'effondre",
    "Investir dans les chèvres : Bonne ou mauvaise idée ?",
    "Mon voisin a vendu sa vache en NFT",
    "Le secret que les banquiers de la Creuse vous cachent",
    "Comment j'ai transformé 10€ en 12€ en 10 ans",
    "L'élevage de poules : Le business model du futur",
    "La blockchain expliquée à ma grand-mère"
];

// Images aléatoires (Picsum)
const getRandomImage = (id) => `https://picsum.photos/seed/${id}/800/400`;

export const seedDatabase = async () => {
    const usersIds = [];

    console.log("🌱 Démarrage du semi...");

    // 1. Créer 20 utilisateurs
    for (let i = 0; i < 20; i++) {
        const pseudo = PSEUDOS[Math.floor(Math.random() * PSEUDOS.length)] + "_" + i;
        const userRef = await addDoc(collection(db, "users"), {
            email: `fake${i}@loup.com`,
            password: "password123", // Mdp par défaut
            pseudo: pseudo,
            isAdmin: false,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${pseudo}`,
            createdAt: new Date().toISOString()
        });
        usersIds.push({ id: userRef.id, pseudo: pseudo });
    }
    console.log("✅ 20 Utilisateurs créés");

    // 2. Créer 40 articles
    for (let i = 0; i < 40; i++) {
        const randomUser = usersIds[Math.floor(Math.random() * usersIds.length)];
        const title = TITLES[Math.floor(Math.random() * TITLES.length)];

        await addDoc(collection(db, "articles"), {
            title: title,
            content: "Ceci est un article généré automatiquement pour tester la scalabilité de notre bêtise. Investissez prudemment (ou pas). " + title,
            category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            userId: randomUser.id,
            author: randomUser.pseudo,
            likes: Math.floor(Math.random() * 100), // Fake likes initiaux
            likedBy: [], // Personne n'a encore vraiment liké
            imageUrl: getRandomImage(i), // Image unique par post
            createdAt: Timestamp.now()
        });
    }
    console.log("✅ 40 Articles créés");
    console.log("🎉 Base de données fertilisée !");
};