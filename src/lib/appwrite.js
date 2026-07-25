import { Client, Account, Databases, Storage } from "appwrite";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || "6a5b3134001064862b43";

// True once the Groupe TKR Appwrite project has been created and its ID
// added to .env.local — until then, the site runs entirely on the
// provisional local content in src/data/seed/*.json.
export const isAppwriteConfigured = Boolean(PROJECT_ID);

const client = new Client();
if (isAppwriteConfigured) {
  client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "6a5b328400308612967e";

export const COLLECTIONS = {
  branches: import.meta.env.VITE_COL_BRANCHES || "branches",
  values: import.meta.env.VITE_COL_VALUES || "values",
  services: import.meta.env.VITE_COL_SERVICES || "services",
  projects: import.meta.env.VITE_COL_PROJECTS || "projects",
  team: import.meta.env.VITE_COL_TEAM || "team",
  testimonials: import.meta.env.VITE_COL_TESTIMONIALS || "testimonials",
  jobs: import.meta.env.VITE_COL_JOBS || "jobs",
  events: import.meta.env.VITE_COL_EVENTS || "events",
  blog: import.meta.env.VITE_COL_BLOG || "blog",
  rentals: import.meta.env.VITE_COL_RENTALS || "rentals",
  lands: import.meta.env.VITE_COL_LANDS || "lands",
  commerce: import.meta.env.VITE_COL_COMMERCE || "commerce",
  newsletter: import.meta.env.VITE_COL_NEWSLETTER || "newsletter",
  messages: import.meta.env.VITE_COL_MESSAGES || "messages",
  applications: import.meta.env.VITE_COL_APPLICATIONS || "applications",
  settings: import.meta.env.VITE_COL_SETTINGS || "site_settings",
};

// Le document unique contenant les informations globales du site
// (coordonnées, réseaux sociaux) — collection à document unique.
export const SETTINGS_DOC_ID = "main";

// Bucket de stockage des CV et lettres de motivation reçus via la page
// Carrières (seul usage d'Appwrite Storage sur ce projet — les images
// passeront par Cloudinary, voir APPWRITE_SCHEMA.md). Upload autorisé à
// tout le monde (candidat anonyme), lecture réservée aux comptes admin.
export const BUCKET_APPLICATIONS = import.meta.env.VITE_BUCKET_APPLICATIONS || "media";

export const ALLOWED_APPLICATION_FILE_TYPES = [".pdf", ".doc", ".docx"];
export const MAX_APPLICATION_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

export default client;
