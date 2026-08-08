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
 *   2. Dans le projet : Overview > Integrations > API Keys > créez une clé.
 *      Ce script manipule des bases de données, collections, attributs,
 *      documents ET buckets de stockage : cochez "Full Access" (Select all)
 *      plutôt que des scopes individuels — une clé trop restreinte échoue
 *      avec l'erreur "The current user is not authorized...". Si vous
 *      préférez limiter les scopes manuellement, il faut au minimum :
 *      databases.read, databases.write, collections.read, collections.write,
 *      attributes.read, attributes.write, documents.read, documents.write,
 *      buckets.read, buckets.write, files.read, files.write.
 *   3. Copiez .env.example vers .env.local et remplissez :
 *        VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID, APPWRITE_API_KEY
 *   4. Lancez : npm run setup:appwrite
 */
import { Client, Databases, Storage, ID, Permission, Role } from "node-appwrite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || "6a5b328400308612967e";
const BUCKET_APPLICATIONS = process.env.VITE_BUCKET_APPLICATIONS || "media";

if (!PROJECT_ID || !API_KEY) {
  console.error("✗ VITE_APPWRITE_PROJECT_ID et APPWRITE_API_KEY doivent être définis (.env.local).");
  console.error("  Lancez ce script avec : node --env-file=.env.local setup/seed-appwrite.mjs");
  process.exit(1);
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);
const storage = new Storage(client);

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
      ["title_fr", "string", 150], ["title_en", "string", 150],
      ["description_fr", "string", 1000], ["description_en", "string", 1000],
    ],
    relationships: [
      { key: "branch", relatedCollection: "branches", type: "manyToOne", twoWay: true, twoWayKey: "services", onDelete: "restrict" },
    ],
    seed: "services.json",
  },
  {
    id: "projects", name: "Réalisations", perms: CONTENT_PERMS,
    attrs: [
      ["title_fr", "string", 150], ["title_en", "string", 150],
      ["location_fr", "string", 150], ["location_en", "string", 150],
      ["description_fr", "string", 1000], ["description_en", "string", 1000],
      ["image", "url", null],
    ],
    relationships: [
      { key: "branch", relatedCollection: "branches", type: "manyToOne", twoWay: true, twoWayKey: "projects", onDelete: "restrict" },
    ],
    seed: "projects.json",
  },
  {
    id: "team", name: "Équipe", perms: CONTENT_PERMS,
    attrs: [
      ["name", "string", 150],
      ["role_fr", "string", 150], ["role_en", "string", 150],
      ["bio_fr", "string", 1000], ["bio_en", "string", 1000],
      ["photo", "url", null],
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
      ["type_fr", "string", 60], ["type_en", "string", 60],
      ["location_fr", "string", 150], ["location_en", "string", 150],
      ["description_fr", "string", 1500], ["description_en", "string", 1500],
    ],
    relationships: [
      { key: "branch", relatedCollection: "branches", type: "manyToOne", twoWay: true, twoWayKey: "jobs", onDelete: "restrict" },
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
      ["coverImage", "url", null],
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
      ["images", "url[]", null],
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
      ["images", "url[]", null],
    ],
    seed: "lands.json",
  },
  {
    id: "commerce", name: "Commerce général", perms: CONTENT_PERMS,
    attrs: [
      ["title_fr", "string", 150], ["title_en", "string", 150],
      ["description_fr", "string", 1000], ["description_en", "string", 1000],
      ["images", "url[]", null],
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
  {
    id: "applications", name: "Candidatures", perms: LEADS_PERMS,
    attrs: [
      ["job_title", "string", 150],
      ["name", "string", 150],
      ["email", "string", 200],
      ["phone", "string", 40],
      ["message", "string", 2000],
      ["cv_file_id", "string", 100],
      ["cv_file_name", "string", 200],
      ["cover_letter_file_id", "string", 100],
      ["cover_letter_file_name", "string", 200],
      ["status", "string", 30],
      ["response", "string", 2000],
      ["date", "string", 30],
    ],
    seed: "applications.json",
  },
  {
    id: "site_settings", name: "Coordonnées & réseaux sociaux", perms: CONTENT_PERMS,
    attrs: [
      ["contactEmail", "string", 150],
      ["contactPhone", "string", 60],
      ["address", "string", 255],
      ["facebookUrl", "url", null],
      ["linkedinUrl", "url", null],
      ["twitterUrl", "url", null],
    ],
    seed: "settings.json",
  },
];

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function ensureDatabase() {
  try {
    await databases.get(DATABASE_ID);
    console.log(`✓ Base de données "${DATABASE_ID}" déjà présente.`);
  } catch (e) {
    if (!/could not be found/i.test(e.message)) {
      // La base existe peut-être déjà : ce n'est pas un "not found", donc
      // inutile de tenter une création qui échouerait pour une tout autre
      // raison (clé invalide, mauvais projet…) — on remonte l'erreur telle
      // quelle pour un diagnostic clair au lieu de la masquer.
      throw e;
    }
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
      if (type === "url") await databases.createUrlAttribute(DATABASE_ID, col.id, attrName, false);
      if (type === "url[]") await databases.createUrlAttribute(DATABASE_ID, col.id, attrName, false, undefined, true);
      await sleep(250); // laisse Appwrite indexer l'attribut avant le suivant
    } catch (e) {
      console.warn(`    (attribut "${attrName}" ignoré : ${e.message})`);
    }
  }

  // Relations (Appwrite "Relationship" attributes) — matérialisent les
  // références entre collections (ex : services.branch → branches) au lieu
  // d'un simple champ texte. La collection ciblée (ex : "branches") doit
  // déjà exister : c'est garanti ici car COLLECTIONS liste "branches" en
  // premier, donc elle est créée avant "services"/"projects"/"jobs".
  for (const rel of col.relationships || []) {
    try {
      await sleep(300);
      await databases.createRelationshipAttribute(
        DATABASE_ID,
        col.id,
        rel.relatedCollection,
        rel.type,
        rel.twoWay ?? false,
        rel.key,
        rel.twoWayKey,
        rel.onDelete || "restrict"
      );
      console.log(`  ✓ Relation "${rel.key}" → "${rel.relatedCollection}" créée (${rel.type}).`);
    } catch (e) {
      console.warn(`    (relation "${rel.key}" ignorée : ${e.message})`);
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

async function ensureApplicationsBucket() {
  const perms = [
    Permission.create(Role.any()), // un candidat anonyme peut déposer un fichier
    Permission.read(Role.users()), // seul un compte admin authentifié peut le relire/télécharger
    Permission.delete(Role.users()),
  ];
  try {
    await storage.getBucket(BUCKET_APPLICATIONS);
    await storage.updateBucket(BUCKET_APPLICATIONS, "Candidatures (CV / lettres)", perms, false, true, 5 * 1024 * 1024, ["pdf", "doc", "docx"]);
    console.log(`✓ Bucket de stockage "${BUCKET_APPLICATIONS}" déjà présent — permissions mises à jour.`);
  } catch (e) {
    if (!String(e.message).includes("could not be found")) {
      console.warn(`  (impossible de mettre à jour le bucket : ${e.message})`);
      return;
    }
    await storage.createBucket(BUCKET_APPLICATIONS, "Candidatures (CV / lettres)", perms, false, true, 5 * 1024 * 1024, ["pdf", "doc", "docx"]);
    console.log(`✓ Bucket de stockage "${BUCKET_APPLICATIONS}" créé (5 Mo max, PDF/DOC/DOCX uniquement).`);
  }
}

async function checkConnectivity() {
  const url = `${ENDPOINT}/health`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    console.log(`✓ Réseau OK — ${ENDPOINT} est joignable (réponse HTTP ${res.status}).`);
    console.log(`  (Ce test ne transmet pas encore votre clé API : un code différent de 200 ici`);
    console.log(`  est normal et ne veut PAS dire que la clé est invalide — seul le test suivant,`);
    console.log(`  avec vos identifiants, le dira.)`);
  } catch (e) {
    console.error(`✗ Impossible de joindre ${url} avant même de parler à Appwrite.`);
    printNetworkDiagnostics(e);
    process.exit(1);
  }
}

function printNetworkDiagnostics(e) {
  console.error(`  Détail : ${e.message}`);
  if (e.cause) console.error(`  Cause  : ${e.cause.code || ""} ${e.cause.message || e.cause}`);
  console.error(`  Node   : ${process.version} (14 minimum requis pour fetch natif ; 18+ recommandé)`);
  console.error("\nPistes de dépannage, dans cet ordre :");
  console.error("  1. Testez depuis un terminal (hors du script) :");
  console.error(`       curl -I ${ENDPOINT}/health`);
  console.error("     Si curl échoue aussi → le problème est réseau, pas le script.");
  console.error("  2. Vérifiez votre connexion Internet tout court (ouvrez un site dans le navigateur).");
  console.error("  3. Si vous êtes sur un VPN, un proxy d'entreprise ou un réseau très restrictif");
  console.error("     (bureau, université…), désactivez-le ou essayez depuis un point d'accès mobile.");
  console.error("  4. Vérifiez que rien ne bloque le trafic HTTPS sortant (pare-feu, antivirus).");
  console.error("  5. Vérifiez le statut d'Appwrite Cloud : https://status.appwrite.io");
  console.error("  6. Si vous êtes derrière un proxy obligatoire, définissez HTTPS_PROXY avant de relancer :");
  console.error("       HTTPS_PROXY=http://votre-proxy:port npm run setup:appwrite");
}

async function main() {
  console.log(`Connexion à ${ENDPOINT} (projet ${PROJECT_ID})…`);
  await checkConnectivity();
  await ensureDatabase();
  for (const col of COLLECTIONS) {
    console.log(`\n→ Collection "${col.id}"`);
    await ensureCollection(col);
    await sleep(500);
    await seedCollection(col);
  }
  console.log("");
  await ensureApplicationsBucket();
  console.log("\n✓ Terminé. Le site utilisera désormais Appwrite dès que VITE_APPWRITE_PROJECT_ID est renseigné côté front (.env.local).");
}

main().catch((e) => {
  console.error("✗ Erreur :", e.message);

  const isAppwriteException = e.name === "AppwriteException" || (e.code !== undefined && e.type !== undefined);
  if (isAppwriteException) {
    console.error(`  Code Appwrite : ${e.code}`);
    console.error(`  Type Appwrite : ${e.type || "(non précisé)"}`);
    if (e.response) console.error(`  Réponse brute : ${JSON.stringify(e.response)}`);
  }

  if (e.message === "fetch failed" || e.cause) {
    printNetworkDiagnostics(e);
  } else if (/not authorized/i.test(e.message)) {
    console.error("\n  → Le \"type\" Appwrite ci-dessus donne la vraie cause. Les plus fréquentes :");
    console.error("    • \"general_unauthorized_scope\" → la clé n'a toujours pas le bon scope pour");
    console.error("      CETTE action précise (vérifiez que vous avez bien cliqué Update/Save après");
    console.error("      avoir coché Full Access — sur certaines versions, cocher ne suffit pas sans");
    console.error("      cliquer sur le bouton d'enregistrement).");
    console.error("    • \"user_unauthorized\" ou \"project_unknown\" → la clé appartient à un AUTRE");
    console.error("      projet que celui visé. Vérifiez que l'ID en haut de la page Overview de la");
    console.error(`      console Appwrite correspond exactement à VITE_APPWRITE_PROJECT_ID`);
    console.error(`      (actuellement : ${PROJECT_ID}) — et que la clé a été créée DANS ce projet,`);
    console.error("      pas dans un autre projet du même compte.");
    console.error("    • Clé recréée mais .env.local pas mis à jour → Appwrite n'affiche le secret");
    console.error("      qu'une seule fois à la création ; si vous avez créé une NOUVELLE clé, il");
    console.error("      faut copier son nouveau secret dans APPWRITE_API_KEY, l'ancien ne marche plus.");
    console.error("\n  Pour repartir sur une base saine : supprimez la clé actuelle, créez-en une");
    console.error("  toute nouvelle avec Full Access coché DÈS LA CRÉATION (pas ajouté après coup),");
    console.error("  collez son secret dans .env.local, puis relancez : npm run setup:appwrite");
  } else {
    console.error("  (Cette erreur vient d'Appwrite lui-même, pas du réseau — vérifiez la clé API,");
    console.error("   ses scopes, et l'ID du projet dans .env.local.)");
  }
  process.exit(1);
});
