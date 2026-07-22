/**
 * Crée la base de données et les collections Appwrite du Groupe TKR,
 * puis les remplit avec le contenu provisoire de src/data/seed.
 *
 * Ce script tourne UNIQUEMENT en local, sur votre machine (jamais dans ce
 * sandbox, qui n'a pas accès à Internet vers Appwrite). Il utilise une clé
 * API serveur qui ne doit jamais être commitée ni partagée.
 *
 * Utilisation :
 *   1. Créez un projet sur https://cloud.appwrite.io
 *   2. Dans le projet : Overview > Integrations > API Keys > créez une clé
 *      avec les scopes "databases.write" (ou Full Access pour aller vite).
 *   3. Copiez .env.example vers .env.local et remplissez :
 *        VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, APPWRITE_API_KEY
 *   4. Lancez : npm run setup:appwrite
 */
import { Client, Databases, ID, Permission, Role } from "node-appwrite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || "tkr_main";

if (!PROJECT_ID || !API_KEY) {
  console.error("✗ VITE_APPWRITE_PROJECT_ID et APPWRITE_API_KEY doivent être définis (.env.local).");
  console.error("  Lancez ce script avec : node --env-file=.env.local setup/seed-appwrite.mjs");
  process.exit(1);
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

// --- Modèle de permissions -------------------------------------------------
// CONTENT : lisible par tout le monde (site public), modifiable uniquement
//   par un utilisateur Appwrite authentifié (donc : les comptes admin créés
//   dans Auth > Users — voir README.md étape 4). Un visiteur anonyme ne peut
//   jamais créer/modifier/supprimer.
// LEADS : un visiteur anonyme peut UNIQUEMENT créer un document (soumission
//   du formulaire de contact ou de la newsletter). Il ne peut ni le relire,
//   ni le modifier, ni le lire — seul un compte admin authentifié le peut.
//   Cela protège la confidentialité des messages reçus.
const CONTENT_PERMS = [
  Permission.read(Role.any()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];
const LEADS_PERMS = [
  Permission.create(Role.any()),
  Permission.read(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

// Définition des collections : id, nom affiché, et attributs Appwrite.
const COLLECTIONS = [
  {
    id: "branches", name: "Branches", perms: CONTENT_PERMS,
    attrs: [
      ["code", "string", 8], ["color", "string", 20],
      ["name_fr", "string", 100], ["name_en", "string", 100],
      ["title_fr", "string", 150], ["title_en", "string", 150],
      ["description_fr", "string", 1000], ["description_en", "string", 1000],
    ],
    seed: "branches.json",
  },
  {
    id: "values", name: "Valeurs", perms: CONTENT_PERMS,
    attrs: [
      ["order", "integer"],
      ["title_fr", "string", 100], ["title_en", "string", 100],
      ["description_fr", "string", 500], ["description_en", "string", 500],
    ],
    seed: "values.json",
  },
  {
    id: "services", name: "Services", perms: CONTENT_PERMS,
    attrs: [
      ["branch", "string", 40],
      ["title_fr", "string", 150], ["title_en", "string", 150],
      ["description_fr", "string", 1000], ["description_en", "string", 1000],
    ],
    seed: "services.json",
  },
  {
    id: "projects", name: "Réalisations", perms: CONTENT_PERMS,
    attrs: [
      ["branch", "string", 40],
      ["title_fr", "string", 150], ["title_en", "string", 150],
      ["location_fr", "string", 150], ["location_en", "string", 150],
      ["description_fr", "string", 1000], ["description_en", "string", 1000],
      ["image", "string", 500],
    ],
    seed: "projects.json",
  },
  {
    id: "team", name: "Équipe", perms: CONTENT_PERMS,
    attrs: [
      ["name", "string", 150],
      ["role_fr", "string", 150], ["role_en", "string", 150],
      ["bio_fr", "string", 1000], ["bio_en", "string", 1000],
      ["photo", "string", 500],
    ],
    seed: "team.json",
  },
  {
    id: "testimonials", name: "Témoignages", perms: CONTENT_PERMS,
    attrs: [
      ["name", "string", 150],
      ["role_fr", "string", 150], ["role_en", "string", 150],
      ["quote_fr", "string", 1000], ["quote_en", "string", 1000],
    ],
    seed: "testimonials.json",
  },
  {
    id: "jobs", name: "Offres d'emploi", perms: CONTENT_PERMS,
    attrs: [
      ["title_fr", "string", 150], ["title_en", "string", 150],
      ["branch", "string", 40],
      ["type_fr", "string", 60], ["type_en", "string", 60],
      ["location_fr", "string", 150], ["location_en", "string", 150],
      ["description_fr", "string", 1500], ["description_en", "string", 1500],
    ],
    seed: "jobs.json",
  },
  {
    id: "events", name: "Événements", perms: CONTENT_PERMS,
    attrs: [
      ["title_fr", "string", 150], ["title_en", "string", 150],
      ["date", "string", 20],
      ["location_fr", "string", 150], ["location_en", "string", 150],
      ["description_fr", "string", 1000], ["description_en", "string", 1000],
    ],
    seed: "events.json",
  },
  {
    id: "blog", name: "Blog", perms: CONTENT_PERMS,
    attrs: [
      ["title_fr", "string", 200], ["title_en", "string", 200],
      ["date", "string", 20], ["author", "string", 100],
      ["excerpt_fr", "string", 500], ["excerpt_en", "string", 500],
      ["content_fr", "string", 5000], ["content_en", "string", 5000],
    ],
    seed: "blog.json",
  },
  {
    id: "rentals", name: "Maisons à louer", perms: CONTENT_PERMS,
    attrs: [
      ["title_fr", "string", 150], ["title_en", "string", 150],
      ["location_fr", "string", 150], ["location_en", "string", 150],
      ["rooms", "integer"],
      ["price_fr", "string", 100], ["price_en", "string", 100],
      ["description_fr", "string", 1000], ["description_en", "string", 1000],
      ["image", "string", 500],
    ],
    seed: "rentals.json",
  },
  {
    id: "lands", name: "Terrains à vendre", perms: CONTENT_PERMS,
    attrs: [
      ["title_fr", "string", 150], ["title_en", "string", 150],
      ["location_fr", "string", 150], ["location_en", "string", 150],
      ["surface", "string", 40],
      ["price_fr", "string", 100], ["price_en", "string", 100],
      ["description_fr", "string", 1000], ["description_en", "string", 1000],
      ["image", "string", 500],
    ],
    seed: "lands.json",
  },
  {
    id: "commerce", name: "Commerce général", perms: CONTENT_PERMS,
    attrs: [
      ["title_fr", "string", 150], ["title_en", "string", 150],
      ["description_fr", "string", 1000], ["description_en", "string", 1000],
    ],
    seed: "commerce.json",
  },
  {
    id: "newsletter", name: "Abonnés newsletter", perms: LEADS_PERMS,
    attrs: [
      ["email", "string", 200],
      ["date", "string", 30],
    ],
    seed: "newsletter.json",
  },
  {
    id: "messages", name: "Messages reçus", perms: LEADS_PERMS,
    attrs: [
      ["name", "string", 150],
      ["email", "string", 200],
      ["message", "string", 2000],
      ["date", "string", 30],
    ],
    seed: "messages.json",
  },
];

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function ensureDatabase() {
  try {
    await databases.get(DATABASE_ID);
    console.log(`✓ Base de données "${DATABASE_ID}" déjà présente.`);
  } catch {
    await databases.create(DATABASE_ID, "Groupe TKR");
    console.log(`✓ Base de données "${DATABASE_ID}" créée.`);
  }
}

async function ensureCollection(col) {
  try {
    await databases.getCollection(DATABASE_ID, col.id);
    console.log(`  ✓ Collection "${col.id}" déjà présente — mise à jour des permissions…`);
    await databases.updateCollection(DATABASE_ID, col.id, col.name, col.perms, false);
    return;
  } catch (e) {
    if (!String(e.message).includes("could not be found")) {
      console.warn(`    (impossible de mettre à jour les permissions : ${e.message})`);
      return;
    }
    await databases.createCollection(DATABASE_ID, col.id, col.name, col.perms, false);
    console.log(`  ✓ Collection "${col.id}" créée.`);
  }

  for (const [attrName, type, size] of col.attrs) {
    try {
      if (type === "string") await databases.createStringAttribute(DATABASE_ID, col.id, attrName, size, false);
      if (type === "integer") await databases.createIntegerAttribute(DATABASE_ID, col.id, attrName, false);
      await sleep(250); // laisse Appwrite indexer l'attribut avant le suivant
    } catch (e) {
      console.warn(`    (attribut "${attrName}" ignoré : ${e.message})`);
    }
  }
}

async function seedCollection(col) {
  const seedPath = path.join(__dirname, "..", "src", "data", "seed", col.seed);
  const docs = JSON.parse(fs.readFileSync(seedPath, "utf-8"));
  for (const doc of docs) {
    const { $id, ...data } = doc;
    try {
      await databases.createDocument(DATABASE_ID, col.id, $id || ID.unique(), data);
    } catch (e) {
      console.warn(`    (document "${$id}" ignoré : ${e.message})`);
    }
  }
  console.log(`  ✓ ${docs.length} document(s) importé(s) dans "${col.id}".`);
}

async function main() {
  console.log(`Connexion à ${ENDPOINT} (projet ${PROJECT_ID})…`);
  await ensureDatabase();
  for (const col of COLLECTIONS) {
    console.log(`\n→ Collection "${col.id}"`);
    await ensureCollection(col);
    await sleep(500);
    await seedCollection(col);
  }
  console.log("\n✓ Terminé. Le site utilisera désormais Appwrite dès que VITE_APPWRITE_PROJECT_ID est renseigné côté front (.env.local).");
}

main().catch((e) => {
  console.error("✗ Erreur :", e.message);
  process.exit(1);
});
