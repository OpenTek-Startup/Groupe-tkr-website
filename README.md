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

Ce script crée automatiquement la base de données, les 9 collections
(branches, services, projets, équipe, témoignages, offres d'emploi,
événements, blog, valeurs) et y importe le contenu provisoire, pour que vous
puissiez tout de suite tester le back-office avant de saisir le contenu réel.

## 4. Créer un compte administrateur (back-office)

Dans la console Appwrite du projet : **Auth > Users > Create user**, avec
l'email et le mot de passe qui serviront à se connecter sur `/admin/login`.

## 5. Utiliser le back-office

- `/admin/login` — connexion
- `/admin` — tableau de bord
- `/admin/collections/:key` — gestion de chaque collection (créer, modifier,
  supprimer des services, projets, membres d'équipe, offres d'emploi…)

## 6. Déploiement sur Vercel

1. Pousser ce projet sur un dépôt GitHub (Opentek ou Groupe TKR).
2. Sur https://vercel.com, importer le dépôt.
3. Renseigner les variables d'environnement de `.env.local` dans
   **Project Settings > Environment Variables**.
4. Déployer. Le nom de domaine du Groupe TKR pourra ensuite être rattaché
   dans **Project Settings > Domains**.

## Structure du projet

```
src/
  data/seed/        contenu provisoire (fictif), utilisé tant qu'Appwrite
                     n'est pas configuré
  lib/appwrite.js    client Appwrite + configuration des collections
  services/          accès aux données (Appwrite + repli automatique)
  i18n/              dictionnaires FR/EN
  components/        Navbar, Footer, cartes, composants d'UI partagés
  pages/public/      Accueil, À propos, Services, Réalisations, Carrières,
                     Événements, Blog, Contact, Mentions légales
  pages/admin/       back-office (connexion, tableau de bord, gestion des
                     collections)
setup/seed-appwrite.mjs   script de provisionnement Appwrite (local uniquement)
```

## Prochaines étapes

- Remplacer le contenu provisoire par les informations réelles du Groupe TKR
  (voir le document « Fiche de collecte de contenu » transmis séparément).
- Choisir et acheter le nom de domaine, puis le connecter sur Vercel (voir le
  devis « Hébergement & Nom de domaine »).
- Ajouter les vraies photos (chantiers, terrains, poissons, équipe) via le
  back-office, une fois les visuels reçus.
