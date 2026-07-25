import { databases, storage, DATABASE_ID, COLLECTIONS, BUCKET_APPLICATIONS, isAppwriteConfigured } from "../lib/appwrite";
import { ID, Query } from "appwrite";

import branchesSeed from "../data/seed/branches.json";
import valuesSeed from "../data/seed/values.json";
import servicesSeed from "../data/seed/services.json";
import projectsSeed from "../data/seed/projects.json";
import teamSeed from "../data/seed/team.json";
import testimonialsSeed from "../data/seed/testimonials.json";
import jobsSeed from "../data/seed/jobs.json";
import eventsSeed from "../data/seed/events.json";
import blogSeed from "../data/seed/blog.json";
import rentalsSeed from "../data/seed/rentals.json";
import landsSeed from "../data/seed/lands.json";
import commerceSeed from "../data/seed/commerce.json";
import newsletterSeed from "../data/seed/newsletter.json";
import messagesSeed from "../data/seed/messages.json";
import applicationsSeed from "../data/seed/applications.json";
import settingsSeed from "../data/seed/settings.json";

const SEED = {
  branches: branchesSeed,
  values: valuesSeed,
  services: servicesSeed,
  projects: projectsSeed,
  team: teamSeed,
  testimonials: testimonialsSeed,
  jobs: jobsSeed,
  events: eventsSeed,
  blog: blogSeed,
  rentals: rentalsSeed,
  lands: landsSeed,
  commerce: commerceSeed,
  newsletter: newsletterSeed,
  messages: messagesSeed,
  applications: applicationsSeed,
  settings: settingsSeed,
};

/**
 * Renvoie { items, source } où source vaut "appwrite" ou "provisoire".
 * Tant que le compte Appwrite du Groupe TKR n'est pas configuré (ou en cas
 * d'erreur réseau), le site continue de fonctionner avec le contenu
 * provisoire défini dans src/data/seed.
 */
export async function listItems(collectionKey, queries = []) {
  if (isAppwriteConfigured) {
    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS[collectionKey], queries);
      return { items: res.documents, source: "appwrite" };
    } catch (err) {
      console.warn(`[dataService] Appwrite indisponible pour "${collectionKey}" — repli sur le contenu provisoire.`, err.message);
    }
  }
  return { items: SEED[collectionKey] || [], source: "provisoire" };
}

export async function getItem(collectionKey, id) {
  if (isAppwriteConfigured) {
    try {
      const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS[collectionKey], id);
      return { item: doc, source: "appwrite" };
    } catch (err) {
      console.warn(`[dataService] Appwrite indisponible pour "${collectionKey}/${id}" — repli sur le contenu provisoire.`, err.message);
    }
  }
  const item = (SEED[collectionKey] || []).find((d) => d.$id === id) || null;
  return { item, source: "provisoire" };
}

// --- Écriture : disponible uniquement lorsque Appwrite est configuré et ---
// --- que l'utilisateur admin est authentifié.                           ---
export async function createItem(collectionKey, data) {
  if (!isAppwriteConfigured) throw new Error("Appwrite n'est pas encore configuré (voir .env.local).");
  return databases.createDocument(DATABASE_ID, COLLECTIONS[collectionKey], ID.unique(), data);
}

export async function updateItem(collectionKey, id, data) {
  if (!isAppwriteConfigured) throw new Error("Appwrite n'est pas encore configuré (voir .env.local).");
  return databases.updateDocument(DATABASE_ID, COLLECTIONS[collectionKey], id, data);
}

export async function deleteItem(collectionKey, id) {
  if (!isAppwriteConfigured) throw new Error("Appwrite n'est pas encore configuré (voir .env.local).");
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS[collectionKey], id);
}

// --- Fichiers (CV / lettres de motivation) -------------------------------
// Upload possible pour n'importe quel visiteur (candidat anonyme) — voir le
// modèle de permissions du bucket dans setup/seed-appwrite.mjs : seule la
// création est autorisée aux anonymes, la lecture reste réservée aux admins.
export async function uploadApplicationFile(file) {
  if (!isAppwriteConfigured) throw new Error("Appwrite n'est pas encore configuré.");
  const uploaded = await storage.createFile(BUCKET_APPLICATIONS, ID.unique(), file);
  return uploaded.$id;
}

export function getApplicationFileDownloadUrl(fileId) {
  if (!isAppwriteConfigured || !fileId) return null;
  return storage.getFileDownload(BUCKET_APPLICATIONS, fileId).toString();
}

export { Query };
