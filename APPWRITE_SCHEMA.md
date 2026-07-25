# Schema Appwrite — Groupe TKR

Ce document liste les collections du projet Appwrite du Groupe TKR. Le code
du front est déjà prêt à les consommer (voir `src/lib/appwrite.js`) : les
identifiants ci-dessous sont déjà les valeurs par défaut dans le code, donc
il suffit de créer les collections dans la console Appwrite (ou de lancer
`npm run setup:appwrite`, qui automatise tout ce document) pour que le site
et le back-office basculent du contenu provisoire vers les vraies données.

- **Projet Appwrite** : ID `6a5b3134001064862b43`
- **Base de données à utiliser** : celle déjà existante
  (`VITE_APPWRITE_DATABASE_ID`, ID actuel `6a5b328400308612967e`)

Le script `setup/seed-appwrite.mjs` crée automatiquement les 16 collections
ci-dessous avec leurs attributs, permissions et contenu provisoire — ce
document sert de référence si vous préférez les créer manuellement dans la
console, ou pour comprendre ce que le script met en place.

---

## 1. `branches` (les filières du Groupe — PRIORITAIRE)

**Bilingue** : les champs de texte existent en deux versions, suffixées
`_fr` et `_en`. Le front public affiche la version de la langue courante,
avec repli automatique sur l'autre langue si une traduction manque.

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| code | string (8) | non | Ex : "01", "02"… ordre d'affichage |
| color | string (20) | non | amber / brick / teal / indigo / slate |
| link | string (255) | non | Lien personnalisé (ex : Commerce Général pointe vers sa propre page plutôt qu'une ancre) |
| name_fr | string (100) | oui | Nom court (français) |
| name_en | string (100) | non | Nom court (anglais) |
| title_fr | string (150) | oui | Titre affiché (français) |
| title_en | string (150) | non | Titre affiché (anglais) |
| description_fr | string (1000) | oui | |
| description_en | string (1000) | non | |

Permissions : lecture `any`, écriture réservée aux comptes admin (`users`).

## 2. `values` (valeurs du Groupe)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| order | integer | non | Ordre d'affichage |
| title_fr / title_en | string (100) | oui / non | |
| description_fr / description_en | string (500) | oui / non | |

## 3. `services`

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| branch | string (40) | oui | ID du document `branches` correspondant (btp / immobilier / aquaculture / opentek) |
| title_fr / title_en | string (150) | oui / non | |
| description_fr / description_en | string (1000) | oui / non | |

*Remarque : la filière `commerce` n'a pas d'entrée ici — elle a sa propre
collection `commerce` (section 11) et sa propre page publique.*

## 4. `projects` (réalisations)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| branch | string (40) | oui | |
| title_fr / title_en | string (150) | oui / non | |
| location_fr / location_en | string (150) | oui / non | |
| description_fr / description_en | string (1000) | oui / non | |
| image | **URL** | non | URL Cloudinary complète (voir section Cloudinary) |

## 5. `team` (équipe)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| name | string (150) | oui | (pas de traduction nécessaire) |
| role_fr / role_en | string (150) | oui / non | |
| bio_fr / bio_en | string (1000) | non | |
| photo | **URL** | non | URL Cloudinary complète |

## 6. `testimonials` (témoignages)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| name | string (150) | oui | |
| role_fr / role_en | string (150) | non | Fonction / société |
| quote_fr / quote_en | string (1000) | oui / non | |

## 7. `jobs` (offres d'emploi)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| title_fr / title_en | string (150) | oui / non | |
| branch | string (40) | non | |
| type_fr / type_en | string (60) | non | CDI, CDD… |
| location_fr / location_en | string (150) | non | |
| description_fr / description_en | string (1500) | oui / non | |

## 8. `events` (événements)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| title_fr / title_en | string (150) | oui / non | |
| date | string (20) | oui | Format AAAA-MM-JJ |
| location_fr / location_en | string (150) | non | |
| description_fr / description_en | string (1000) | non | |

## 9. `blog`

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| title_fr / title_en | string (200) | oui / non | |
| date | string (20) | oui | |
| author | string (100) | non | |
| excerpt_fr / excerpt_en | string (500) | non | Résumé affiché dans la liste |
| content_fr / content_en | string (5000) | oui / non | Corps de l'article |
| coverImage | **URL** | non | URL Cloudinary complète |

Index utile : index sur `date` (tri chronologique).

## 10. `rentals` (maisons à louer)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| title_fr / title_en | string (150) | oui / non | |
| location_fr / location_en | string (150) | non | |
| rooms | integer | non | Nombre de pièces |
| price_fr / price_en | string (100) | non | Texte libre (ex : "150 000 FCFA / mois") |
| description_fr / description_en | string (1000) | non | |
| images | **URL[]** (tableau) | non | Plusieurs URLs Cloudinary — alimente le carrousel du bouton « Voir plus » |

## 11. `lands` (terrains à vendre)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| title_fr / title_en | string (150) | oui / non | |
| location_fr / location_en | string (150) | non | |
| surface | string (40) | non | Ex : "500 m²" |
| price_fr / price_en | string (100) | non | |
| description_fr / description_en | string (1000) | non | |
| images | **URL[]** (tableau) | non | Idem `rentals.images` |

## 12. `commerce` (commerce général)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| title_fr / title_en | string (150) | oui / non | |
| description_fr / description_en | string (1000) | non | |
| images | **URL[]** (tableau) | non | 1 à 3 images conseillées, affichées en mosaïque sur la carte |

## 13. `newsletter` (abonnés)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| email | string (200) | oui | |
| date | string (30) | oui | |

Permissions recommandées :
- Création (`create`) : `any` (n'importe quel visiteur doit pouvoir s'abonner)
- Lecture / mise à jour / suppression : réservées au compte admin

## 14. `messages` (formulaire de contact)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| name | string (150) | oui | |
| email | string (200) | oui | |
| message | string (2000) | oui | |
| date | string (30) | oui | |

Permissions : identiques à `newsletter` (création publique, lecture admin
uniquement — confidentialité des messages reçus).

## 15. `applications` (candidatures)

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| job_title | string (150) | non | Copie de l'intitulé du poste au moment de la candidature |
| name | string (150) | oui | |
| email | string (200) | oui | |
| phone | string (40) | non | |
| message | string (2000) | non | Message de motivation libre |
| cv_file_id | string (100) | non | ID fichier dans le bucket `media` |
| cv_file_name | string (200) | non | Nom original du fichier, pour l'affichage admin |
| cover_letter_file_id | string (100) | non | ID fichier dans le bucket `media` |
| cover_letter_file_name | string (200) | non | |
| status | string (30) | non | "nouveau" / "traite" / "refuse" — défaut "nouveau" |
| response | string (2000) | non | Réponse rédigée par l'admin (voir back-office) |
| date | string (30) | oui | |

Permissions : identiques à `newsletter`/`messages` — création publique
(candidat anonyme), lecture/modification réservées au compte admin.

## 16. `site_settings` (coordonnées & réseaux sociaux)

Collection à document unique (un seul document, ID fixe `main`) pour les
informations globales affichées en pied de page et sur la page Contact.

| Attribut | Type | Obligatoire | Notes |
|----------|------|-------------|-------|
| contactEmail | string (150) | non | |
| contactPhone | string (60) | non | |
| address | string (255) | non | |
| facebookUrl | **URL** | non | |
| linkedinUrl | **URL** | non | |
| twitterUrl | **URL** | non | |

Tant que ce document n'existe pas (ou que ses champs sont vides), le site
affiche des espaces réservés clairs (`[à compléter]`) plutôt que des
informations inventées.

---

## Relations entre collections

Comme dans le projet Opentek dont ce schéma s'inspire, aucun attribut de
type **Relationship** n'est utilisé ici. Le seul endroit où une relation
aurait un sens est `applications.job_title`, qui référence conceptuellement
un poste de la collection `jobs`. Ce schéma utilise volontairement un champ
`string` dupliqué (copie de l'intitulé au moment de la candidature) plutôt
qu'un attribut Relationship, pour la même raison que le projet Opentek :

1. **Historique fiable** : si une offre d'emploi est modifiée ou supprimée
   plus tard, la candidature continue d'afficher l'intitulé du poste tel
   qu'il était au moment de l'envoi — le comportement attendu pour un
   enregistrement de type archive.
2. **Simplicité** : le back-office reste facile à déboguer directement
   dans la console Appwrite, sans configuration de relation à deux sens.

Aucune autre collection de ce schéma n'a de lien naturel avec une autre.

---

## Stockage (Storage)

**Répartition** : Appwrite Storage pour les documents (CV et lettres de
motivation), Cloudinary pour les images. Ce choix apporte un CDN et une
optimisation automatique du poids des images pour tout ce qui est visuel,
et évite de payer du stockage Appwrite pour des fichiers volumineux.

Créer un bucket nommé `media` (ou renseigner son ID réel dans
`VITE_BUCKET_APPLICATIONS`) pour héberger uniquement :
- les CV envoyés via le formulaire de candidature (`applications.cv_file_id`)
- les lettres de motivation (`applications.cover_letter_file_id`)

**Où le créer dans la console Appwrite** (le script `setup:appwrite` le
fait automatiquement) :
1. Se connecter sur https://cloud.appwrite.io et ouvrir le projet Groupe TKR
2. Dans le menu de gauche : **Storage**
3. Bouton **Create bucket**
4. Nom : `media`
5. Dans l'onglet **Settings** du bucket créé, section **Permissions** :
   ajouter un rôle `Any` avec la permission **Create** (pour l'upload
   public de CV/lettres), et un rôle correspondant aux comptes admin avec
   **Read** et **Delete**
6. Toujours dans Settings : limiter la **taille maximale de fichier** à
   5 Mo et les **extensions autorisées** à pdf, doc, docx — cohérent avec
   la validation déjà faite côté code (`ApplicationModal.jsx`)

## Cloudinary (stockage des images — à activer plus tard)

Toutes les images (réalisations, équipe, blog, biens à louer/vendre,
commerce général) sont conçues pour recevoir une URL complète dans le champ
Appwrite correspondant (`image`, `photo`, `coverImage`, `images`) — le code
actuel accepte déjà n'importe quelle URL d'image dans ces champs, y compris
collée manuellement depuis le back-office. Brancher Cloudinary plus tard ne
demandera donc aucun changement de code, seulement :

1. Récupérer le **cloud name** en haut du dashboard Cloudinary
2. Créer un **upload preset** : Settings > Upload > Upload presets > Add
   upload preset > Signing Mode : **Unsigned** (indispensable pour
   permettre l'upload depuis le navigateur sans exposer de clé secrète)
3. Renseigner `VITE_CLOUDINARY_CLOUD_NAME` et `VITE_CLOUDINARY_UPLOAD_PRESET`
   dans `.env.local` (déjà prévus dans `.env.example`)
4. Optionnel mais recommandé : activer l'optimisation automatique du
   format et de la qualité dans les paramètres du preset ("f_auto, q_auto")

**Type d'attribut Appwrite pour ces champs** : utiliser le type **URL**
(et non **String**) — voir les tableaux ci-dessus. Pour les champs à
plusieurs images (`rentals.images`, `lands.images`, `commerce.images`),
utiliser le type **URL** en mode tableau ("Array" activé lors de la
création de l'attribut) plutôt que plusieurs attributs séparés.

Limite recommandée côté futur widget d'upload : 5 Mo par image, formats
JPEG/PNG/WebP.

---

## Authentification admin

Le back-office (`/admin/*`) utilise `Account` d'Appwrite (email + mot de
passe). Pour créer le premier compte administrateur :

1. Dans la console Appwrite > Auth > Users > "Create user"
2. Renseigner l'email et le mot de passe qui serviront à se connecter sur
   `/admin/login`

**Important** : depuis la dernière mise à jour du site, `/admin` exige
toujours de passer par cette page de connexion — il n'existe aucun accès
en lecture sans compte, y compris pendant que les collections ci-dessus
n'existent pas encore.

Pour la suite, envisager un rôle/label `admin` sur le compte + des règles
de permission par collection qui exigent ce rôle, plutôt que d'ouvrir
l'écriture à tout utilisateur authentifié (voir `Role.users()` dans
`setup/seed-appwrite.mjs`, à remplacer par `Role.label("admin")` si cette
évolution est souhaitée).
