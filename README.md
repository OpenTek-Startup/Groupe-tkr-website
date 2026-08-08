# Site web — Groupe TKR

Site vitrine bilingue (FR/EN) du Groupe TKR, avec back-office d'administration,
construit en React + Vite, prévu pour être branché sur **Appwrite** (contenu +
authentification) et déployé sur **Vercel**.

## État actuel

Le site fonctionne dès maintenant **sans Appwrite**, avec du contenu
provisoire (fictif) situé dans `src/data/seed/*.json`, clairement identifiable
par le bandeau « Contenu provisoire » affiché sur les pages concernées.

Dès que le projet Appwrite est créé et renseigné dans `.env.local`, le site
et le back-office basculent automatiquement sur les données réelles — aucun
changement de code nécessaire.

> **Important — accès au back-office :** `/admin` exige toujours une
> connexion réelle (compte Appwrite). Tant qu'aucun utilisateur n'a été créé
> dans **Auth > Users** de la console Appwrite (voir section 4), **personne
> ne peut se connecter** — le formulaire l'indique clairement. C'est
> volontaire : un back-office ne doit jamais être accessible sans compte,
> même en phase de démonstration.
>
> **Configuration Appwrite :** le projet (`6a5b3134001064862b43`) et la base
> de données (`6a5b328400308612967e`) sont déjà pris en compte par défaut
> dans le code — voir [`APPWRITE_SCHEMA.md`](./APPWRITE_SCHEMA.md) pour le
> détail complet des collections à créer (ou lancez directement
> `npm run setup:appwrite`, qui s'en charge automatiquement). **N'oubliez
> pas de déclarer votre domaine dans Appwrite (Overview > Add platform >
> Web app)** — voir section 2 étape 5 : sans cela, le navigateur bloque les
> requêtes vers Appwrite (erreur CORS) et le site continue d'afficher le
> contenu provisoire même une fois les collections créées.
>
> **Images (Cloudinary) :** les champs « Photos » (biens à louer, terrains,
> commerce général) attendent simplement des URLs d'images. Cloudinary (ou
> tout autre hébergeur d'images) pourra donc être branché plus tard sans
> aucun changement de code : il suffira de coller les URLs Cloudinary dans
> ces champs depuis le back-office.

## 1. Lancer le site en local

```bash
npm install
npm run dev
```
Le site est alors disponible sur http://localhost:5173.

## 2. Créer le compte et le projet Appwrite

1. Aller sur https://cloud.appwrite.io et créer un compte (de préférence avec
   un email dédié au Groupe TKR / Opentek, pas un email personnel).
2. Créer un nouveau projet, par exemple nommé « Groupe TKR ».
3. Dans **Overview > Integrations > API Keys**, créer une clé API serveur.
   Ce script manipule des bases de données, collections, attributs,
   documents **et** buckets de stockage : cocher **Full Access** (Select
   all) plutôt que des scopes individuels — une clé trop restreinte échoue
   avec l'erreur `The current user is not authorized...`.
   **Ne jamais partager cette clé ni la commiter dans Git.**
4. Copier `.env.example` vers `.env.local` et renseigner :
   - `VITE_APPWRITE_PROJECT_ID` (visible dans Overview du projet)
   - `APPWRITE_API_KEY` (la clé créée à l'étape 3)
   - laisser `VITE_APPWRITE_ENDPOINT` tel quel si vous utilisez Appwrite Cloud
5. **Étape indispensable et facile à oublier** : dans **Overview >
   Integrations > Add platform > Web app**, déclarer le(s) domaine(s) depuis
   lesquels le site sera servi (`localhost` pour le développement local,
   puis votre domaine réel une fois déployé sur Vercel, ex.
   `groupetkr.com`). **Sans cette étape, toutes les requêtes du site vers
   Appwrite échouent avec une erreur CORS** — c'est la cause la plus probable
   si le site n'affiche toujours que le contenu provisoire après avoir
   rempli les étapes précédentes.

## 3. Créer les collections et importer le contenu provisoire

Le détail complet des collections (attributs, types, permissions) est documenté
dans [`APPWRITE_SCHEMA.md`](./APPWRITE_SCHEMA.md) — utile si vous préférez
créer les collections manuellement dans la console plutôt que via le script.

Une fois `.env.local` complété :

```bash
npm run setup:appwrite
```

Ce script crée automatiquement la base de données, les 15 collections
(branches, valeurs, services, réalisations, équipe, témoignages, offres
d'emploi, événements, blog, maisons à louer, terrains à vendre, commerce
général, abonnés newsletter, messages reçus, candidatures) ainsi qu'un
bucket de stockage dédié aux CV et lettres de motivation, et y importe le
contenu provisoire, pour que vous puissiez tout de suite tester le
back-office avant de saisir le contenu réel.

Le script attribue aussi les permissions adaptées à chaque collection :
- Contenu du site (branches, services, réalisations…) : lecture publique,
  écriture réservée aux comptes admin authentifiés.
- Newsletter / messages / candidatures : un visiteur peut seulement **créer**
  une entrée (formulaire public, dépôt de CV/lettre), jamais la relire ni la
  modifier — seul un compte admin peut consulter la boîte de réception dans
  le back-office. Le bucket de fichiers suit la même logique : un candidat
  peut déposer un fichier, mais ne peut pas parcourir ou relire les fichiers
  déposés par d'autres candidats.

Vous pouvez relancer `npm run setup:appwrite` à tout moment (par exemple
après avoir mis à jour ce script) : il met à jour les permissions des
collections existantes sans dupliquer leur contenu.

## 4. Créer un compte administrateur (back-office)

Dans la console Appwrite du projet : **Auth > Users > Create user**, avec
l'email et le mot de passe qui serviront à se connecter sur `/admin/login`.
Tout compte créé ainsi a accès à l'ensemble du back-office — n'en créez que
pour les personnes qui doivent réellement gérer le contenu du site.

## 5. Utiliser le back-office

- `/admin/login` — connexion
- `/admin` — tableau de bord
- `/admin/applications` — **Candidatures** reçues via la page Carrières
  (formulaire avec CV + lettre de motivation) : téléchargement des fichiers,
  changement de statut, et réponse. Comme il n'y a pas de service d'envoi
  d'email automatique branché, le bouton « Répondre par email » ouvre votre
  propre logiciel de messagerie avec le texte de réponse déjà rempli —
  aucun email n'est envoyé automatiquement depuis le serveur.
- `/admin/collections/:key` — gestion de chaque collection (créer, modifier,
  supprimer des services, réalisations, biens à louer, offres d'emploi…).
  Les collections « Messages reçus » et « Abonnés newsletter » sont en
  lecture/suppression seule (pas de création manuelle ni de modification),
  puisqu'il s'agit de soumissions venant du site public. Pour les biens
  « Maisons à louer » / « Terrains à vendre », le champ « Photos » accepte
  une URL d'image par ligne : elles s'afficheront dans la galerie du bouton
  « Voir plus » sur le site public.

## 6. Déploiement sur Vercel

1. Pousser ce projet sur un dépôt GitHub (Opentek ou Groupe TKR).
2. Sur https://vercel.com, importer le dépôt.
3. Renseigner les variables d'environnement de `.env.local` dans
   **Project Settings > Environment Variables**.
4. Déployer. Le fichier `vercel.json` inclus configure déjà les redirections
   nécessaires au bon fonctionnement du site (React Router) ainsi que des
   en-têtes de sécurité de base (anti-clickjacking, MIME-sniffing, etc.).
5. Le nom de domaine du Groupe TKR pourra ensuite être rattaché dans
   **Project Settings > Domains**.

## Sécurité

- Aucune clé secrète n'est jamais exposée côté navigateur : `APPWRITE_API_KEY`
  n'est utilisée que par `setup/seed-appwrite.mjs`, en local, et n'est jamais
  préfixée par `VITE_` (donc jamais incluse dans le build).
- Le formulaire de contact et la newsletter incluent un champ « honeypot »
  (piège à robots), une validation d'email et une limite de longueur, côté
  client. Une fois Appwrite branché, seule la création de document est
  autorisée aux visiteurs anonymes sur ces deux collections — la lecture et
  la modification restent réservées aux comptes admin.
- Le back-office (`/admin`) est protégé par l'authentification Appwrite ; les
  actions de modification sont désactivées dans l'interface tant qu'aucun
  utilisateur n'est connecté.
- `.env.local` est exclu de Git via `.gitignore` — ne le committez jamais.

## Structure du projet

```
src/
  data/seed/        contenu provisoire, utilisé tant qu'Appwrite n'est pas
                     configuré (aucune mention « exemple » n'y figure : le
                     bandeau « Contenu provisoire » suffit à le signaler)
  lib/appwrite.js    client Appwrite + configuration des collections
  lib/localFallback.js  sécurité des soumissions (contact/newsletter) tant
                     qu'Appwrite n'est pas encore configuré
  services/          accès aux données (Appwrite + repli automatique)
  i18n/              dictionnaires FR/EN
  components/        Navbar (avec menu « Voir plus »), Footer, cartes, UI
  pages/public/      Accueil, À propos, Services, Réalisations, Carrières,
                     Événements, Blog (+ détail d'article), Maisons à louer,
                     Terrains à vendre, Commerce général, Contact, Mentions
                     légales, page 404
  pages/admin/       back-office (connexion, tableau de bord, gestion des
                     14 collections)
setup/seed-appwrite.mjs   script de provisionnement Appwrite (local uniquement)
vercel.json               redirections SPA + en-têtes de sécurité
```

## Prochaines étapes

- Remplacer le contenu provisoire par les informations réelles du Groupe TKR
  (voir le document « Fiche de collecte de contenu » transmis séparément).
- Choisir et acheter le nom de domaine, puis le connecter sur Vercel (voir le
  devis « Hébergement & Nom de domaine »).
- Ajouter les vraies photos (chantiers, terrains, poissons, équipe) via le
  back-office, une fois les visuels reçus.
- Renseigner les vrais liens des réseaux sociaux dans `Footer.jsx` (les icônes
  restent volontairement inactives — avec l'infobulle « lien à venir » —
  jusqu'à ce que ces liens existent).
