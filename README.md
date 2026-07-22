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
3. Dans **Overview > Integrations > API Keys**, créer une clé API serveur
   avec le scope `databases.write` (ou "Full Access" pour aller plus vite).
   **Ne jamais partager cette clé ni la commiter dans Git.**
4. Copier `.env.example` vers `.env.local` et renseigner :
   - `VITE_APPWRITE_PROJECT_ID` (visible dans Overview du projet)
   - `APPWRITE_API_KEY` (la clé créée à l'étape 3)
   - laisser `VITE_APPWRITE_ENDPOINT` tel quel si vous utilisez Appwrite Cloud

## 3. Créer les collections et importer le contenu provisoire

Une fois `.env.local` complété :

```bash
npm run setup:appwrite
```

Ce script crée automatiquement la base de données, les 14 collections
(branches, valeurs, services, réalisations, équipe, témoignages, offres
d'emploi, événements, blog, maisons à louer, terrains à vendre, commerce
général, abonnés newsletter, messages reçus) et y importe le contenu
provisoire, pour que vous puissiez tout de suite tester le back-office avant
de saisir le contenu réel.

Le script attribue aussi les permissions adaptées à chaque collection :
- Contenu du site (branches, services, réalisations…) : lecture publique,
  écriture réservée aux comptes admin authentifiés.
- Newsletter / messages de contact : un visiteur peut seulement **créer**
  un message (formulaire public), jamais le relire ni le modifier — seul un
  compte admin peut consulter la boîte de réception dans le back-office.

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
- `/admin/collections/:key` — gestion de chaque collection (créer, modifier,
  supprimer des services, réalisations, biens à louer, offres d'emploi…).
  Les collections « Messages reçus » et « Abonnés newsletter » sont en
  lecture/suppression seule (pas de création manuelle ni de modification),
  puisqu'il s'agit de soumissions venant du site public.

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
