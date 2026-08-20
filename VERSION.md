# Historique des livraisons

- **v1** — Scaffold initial du site (front public 9 pages + back-office admin générique), contenu provisoire, Appwrite non branché.
- **v2** — Intégration du vrai logo (navbar, hero, admin), restructuration du menu (dropdown "Voir plus"), pages Maisons à louer / Terrains à vendre / Commerce général, candidatures avec CV + lettre de motivation, sécurisation de l'accès admin.
- **v3** — Corrections logo (halo sur fond sombre), carrousel photo droite→gauche, 5ème filière Commerce Général, sélecteur de langue admin, bande de filières animée.
- **v4** (actuelle) — Branchement réel Appwrite (ID de projet + base de données), collection `site_settings` (coordonnées & réseaux sociaux pilotables depuis l'admin), champs images passés en tableaux d'URLs natifs, document `APPWRITE_SCHEMA.md` complet.
- **v5** (actuelle) — Ajout de la page "Actualités" (blog) dans le menu déroulant "Voir plus", entre Commerce général et Carrières.
- **v6** (actuelle) — `setup/seed-appwrite.mjs` : diagnostic réseau détaillé en cas d'échec ("fetch failed" explicite désormais distingué d'une vraie erreur Appwrite), test de connectivité préalable, conseils de dépannage affichés directement dans le terminal.
- **v7** (actuelle) — Correction des instructions de scopes API Key (« Full Access » recommandé au lieu de deux scopes insuffisants), et diagnostic dédié dans le script pour l'erreur "The current user is not authorized...".
- **v8** (actuelle) — Le script affiche désormais le code, le type et la réponse brute renvoyés par Appwrite (au lieu du seul message générique), et `ensureDatabase` ne masque plus l'erreur réelle avant de retenter une création. Le diagnostic "not authorized" liste maintenant les 3 causes réelles les plus fréquentes (mauvais projet, clé non mise à jour après régénération, scope toujours manquant).
- **v9** (actuelle) — Relations matérialisées : `services.branch`, `projects.branch` et `jobs.branch` sont désormais de vrais attributs Relationship Appwrite (Many to One vers `branches`, bidirectionnels, suppression protégée) au lieu de simples champs texte. Back-office : ces champs deviennent des menus déroulants dynamiques (peuplés depuis la collection liée), la couleur d'une filière est un menu déroulant fixe, et les dates (événements, blog) utilisent un vrai sélecteur de date. `APPWRITE_SCHEMA.md` : tableau consolidé de toutes les permissions collection par collection.
- **v9** (actuelle) — Audit des relations entre collections (déjà en grande partie matérialisées : services/projets/offres d'emploi → filières, en vraies relations Appwrite bidirectionnelles avec protection à la suppression), menus déroulants dans l'admin (filière, couleur, date) au lieu de champs texte libres, tableau récapitulatif de toutes les permissions dans APPWRITE_SCHEMA.md. Bug corrigé : nom du bucket de stockage incohérent entre le script et le reste du code ("applications" vs "media").
- **v10** (actuelle) — La page de connexion admin détecte maintenant une erreur réseau/CORS et affiche directement la solution (déclarer le domaine comme "Web app" dans Appwrite) au lieu d'un message technique cryptique ("Failed to fetch").
- **v11** (actuelle) — La page de connexion admin distingue maintenant une erreur réseau/CORS d'un 401 "identifiants invalides", et affiche pour ce dernier cas un message direct rappelant qu'un utilisateur doit être créé dans Auth > Users (distinct du compte cloud.appwrite.io personnel).
- **v12** (actuelle) — Correction de l'erreur "Creation of a session is prohibited when a session is active" : si une session valide existe déjà (ex : connexion réussie plus tôt), la page de connexion la récupère et redirige automatiquement vers le tableau de bord au lieu d'afficher une erreur bloquante ou de créer une boucle de redirection.

## Note sur le fichier "GroupeTKR-site (4).zip" fourni le 01/08

Ce fichier correspond à une étape antérieure à la v4 (avant l'ID de projet
Appwrite, avant `site_settings`, avant les menus déroulants admin, et avec
un nom de bucket de stockage incorrect — "applications" au lieu de "media").
Vérifié fichier par fichier (`diff -rq`) : **aucune différence de design ou
de structure visuelle** avec la version actuelle — uniquement des fichiers
de câblage Appwrite (relations, permissions, admin) qui ont légitimement
évolué depuis. Le frontend livré en v13 est donc rigoureusement identique
à celui de ce fichier, avec la couche Appwrite mise à jour par-dessus.

- **v13** (actuelle) — Confirmation et re-livraison : même frontend que la
  version fournie, entièrement cohérent avec le dernier modèle Appwrite
  (5 filières, relations, site_settings, permissions, dropdowns admin,
  bucket "media", correctifs de connexion).
- **v14** (actuelle) — Module d'authentification admin complété : affichage/masquage du mot de passe, page "mot de passe oublié" (envoi d'email de récupération Appwrite), page "réinitialisation du mot de passe" (lien reçu par email, avec validation côté client). Bug logo corrigé : le footer utilisait le logo foncé sur fond sombre (même défaut que corrigé précédemment pour l'admin) — bascule vers la variante claire, vérifié par mesure de contraste.
- **v14** (actuelle) — Les images du logo (navbar, hero, footer, admin, favicon) sont désormais strictement identiques, pixel pour pixel, au fichier original fourni (LOGO_TKR.jpeg) — vérifié par comparaison numérique. Sur les fonds sombres (pied de page, barre latérale admin) où le fond blanc de l'image d'origine ne se fondait pas naturellement, un petit cadre blanc a été ajouté autour du logo (traitement d'affichage uniquement, aucune retouche de l'image elle-même).
- **v15** (actuelle) — Travail responsive mobile (uniquement, aucun autre changement) :
  - Navbar mobile : zones tactiles agrandies au minimum recommandé (burger 44×44, FR/EN 40×40, liens ≥44px de haut, au lieu de 14-22px initialement)
  - Bug corrigé : le bouton "Contact" était invisible sur mobile (masqué sans remplacement) — republié dans le panneau du menu mobile, testé bout en bout
  - Bug corrigé : le tableau de gestion des collections admin débordait horizontalement sur mobile (403px sur écran 375px) — passe en affichage empilé sous 640px
  - Bug bloquant corrigé : la barre latérale admin, en position sticky sur mobile, restait figée à l'écran pendant le défilement et interceptait tous les clics sur le contenu — remplacée par un vrai menu burger repliable (comme la navigation publique)
  - Audit complet à 375px et 320px sur les 16 pages publiques + 15 collections admin + candidatures : aucun débordement horizontal restant
  - Aucune régression desktop vérifiée (dropdown, CTA, layout tous identiques à la v14)
