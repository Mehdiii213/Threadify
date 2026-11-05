# CLAUDE.md — Threadify

## Le produit

**Threadify** est un générateur de threads et de carrousels par IA, pensé pour le marché francophone (dans la lignée de Hypefury, Tweet Hunter ou Postnitro aux USA).

- **Problème** : créer un carrousel Instagram/LinkedIn ou un thread X prend des heures (rédaction, découpage, mise en page, design).
- **Promesse** : l'utilisateur écrit une idée ou colle un article → Threadify sort un **carrousel designé prêt à publier** (et/ou un thread X).
- **Cible** : créateurs de contenu, freelances, solopreneurs et équipes marketing francophones.
- **Langue du produit** : français par défaut (interface, contenus générés, messages d'erreur).

### Parcours principal (MVP)

1. L'utilisateur crée un compte / se connecte.
2. Il saisit une idée **ou** colle un article (texte ou URL).
3. Il choisit le format : carrousel Instagram, carrousel LinkedIn ou thread X.
4. L'IA génère le contenu découpé en slides / tweets.
5. Il ajuste le texte et le design (template, couleurs, police).
6. Il exporte (PNG / PDF pour les carrousels, texte copiable pour les threads).
7. Ses créations sont sauvegardées dans son espace.

## Stack imposée

| Rôle | Outil |
|---|---|
| Framework | **Next.js** (App Router, TypeScript) |
| Base de données | **PostgreSQL** |
| ORM | **Prisma** |
| Authentification | **Better Auth** |
| Style | **Tailwind CSS** |

Ne pas remplacer ni ajouter d'alternative à ces briques (pas d'autre ORM, pas de NextAuth/Clerk, pas de CSS-in-JS) sans validation explicite.

## Règles de travail (obligatoires)

1. **Toujours répondre en français**, y compris dans les explications, les plans et les résumés.
2. **Proposer un plan avant tout changement important** (nouvelle fonctionnalité, modification du schéma Prisma, changement d'architecture, ajout de dépendance, refonte d'un écran) et attendre la validation avant de coder.
3. **Chaque étape se termine par une vérification visible dans le navigateur** : indiquer l'URL à ouvrir (ex. `http://localhost:3000/...`) et ce que l'on doit y voir. Une étape n'est pas terminée tant que ce n'est pas vérifiable à l'écran.
4. **Expliquer chaque étape à l'utilisateur comme à un débutant complet** (ne connaît rien au code) : guide pas à pas, clic par clic, en **décrivant la fenêtre noire (cmd)** — son titre, l'invite `C:\Users\mehdi\Threadify-main>`, ce qui s'affiche, comment savoir qu'une commande est terminée — ainsi que chaque écran du navigateur attendu (✅). Sauvegarder ce guide dans `docs/` (modèle : `docs/mettre-a-jour.md`).
5. **Après chaque étape validée, mettre à jour ce CLAUDE.md** :
   - ajouter les décisions prises dans « Journal des décisions » ;
   - ajouter les problèmes rencontrés et leur solution dans « Pièges rencontrés » ;
   - mettre à jour « État d'avancement ».

## Conventions

- TypeScript strict, pas de `any` sans justification.
- Composants serveur par défaut ; `"use client"` uniquement si nécessaire (interactivité, état local).
- Mutations via Server Actions ou Route Handlers (`app/api/...`), toujours avec vérification de session côté serveur.
- Toute modification du schéma passe par une migration Prisma (`npx prisma migrate dev --name <nom>`), jamais de modification manuelle de la base.
- Secrets uniquement dans `.env` (jamais commités) ; maintenir un `.env.example` à jour.
- Textes de l'interface en français.

## Versions installées

- Next.js **16.4.5** (App Router, Turbopack, `cacheComponents` activé), React 19.3
- Tailwind CSS **4** (configuration dans `src/app/globals.css`, pas de `tailwind.config`)
- Prisma **7.10.1** (`prisma`, `@prisma/client`, `@prisma/adapter-pg`) + driver `pg`
- Better Auth **1.7.18**
- PostgreSQL **16**, Node.js 22

> Next.js 16 a des API différentes des versions précédentes : consulter `node_modules/next/dist/docs/` avant d'écrire du code (voir `AGENTS.md`).

## Structure du projet

```
prisma/schema.prisma        # schéma (générateur `prisma-client`, sortie dans src/generated/prisma)
prisma.config.ts            # config Prisma 7 : chemin du schéma, migrations, DATABASE_URL
src/app/                    # routes App Router (layout.tsx, page.tsx, globals.css)
src/app/inscription|connexion/  # pages publiques d'authentification (formulaire client AuthForm)
src/app/espace/             # espace personnel protégé
src/app/api/auth/[...all]/  # route Better Auth (toNextJsHandler)
src/proxy.ts                # redirections rapides selon la présence du cookie de session
src/components/             # composants partagés (site-header, auth-form, db-status…)
src/lib/prisma.ts           # instance unique de PrismaClient (à importer partout)
src/lib/auth.ts             # configuration serveur Better Auth
src/lib/auth-client.ts      # client Better Auth pour les composants "use client"
src/lib/session.ts          # getSession() / requireSession() côté serveur
src/lib/auth-errors.ts      # traduction FR des codes d'erreur Better Auth
src/app/creer/              # page de saisie + Server Action createCreation (actions.ts)
src/app/creations/[id]/     # récapitulatif d'une création (propriétaire uniquement)
src/app/not-found.tsx       # page 404 en français
src/lib/creations.ts        # limites, libellés des formats, extraits, dates FR
docs/                       # guides pas à pas pour l'utilisateur (lancer-en-local, mettre-a-jour, tester-etape-2)
src/generated/prisma/       # client Prisma généré — ignoré par git, recréé par `npm install`
```

## Commandes utiles

```bash
npm run dev                          # serveur de dev sur http://localhost:3000
npm run lint                         # ESLint
npx tsc --noEmit                     # vérification des types
npx prisma generate                  # régénérer le client après une modif du schéma
npx prisma migrate dev --name <nom>  # créer / appliquer une migration
npx prisma studio                    # explorer la base
```

## Lancer le projet sur son ordinateur

Prérequis : Node.js 20+ et PostgreSQL (local, ou base en ligne type Neon / Supabase).

```bash
git clone https://github.com/Mehdiii213/Threadify.git && cd Threadify
createdb threadify                  # ou créer la base via votre outil habituel
cp .env.example .env                # puis renseigner DATABASE_URL
npm install                         # installe et génère le client Prisma (postinstall)
npx prisma migrate deploy           # applique les migrations (à partir de l'étape 1)
npm run dev
```

Puis ouvrir http://localhost:3000. Après chaque étape validée : `git pull`, `npm install`, `npx prisma migrate deploy`.

Guide détaillé pour débutant (Windows/Mac, base Supabase, dépannage) : **`docs/lancer-en-local.md`** — à tenir à jour à chaque étape qui change l'installation (ex. migrations à l'étape 1).

## Environnement de développement de Claude (session cloud)

Claude travaille dans un conteneur cloud temporaire : `localhost:3000` n'y est **pas accessible** depuis le navigateur de l'utilisateur. La vérification visible de chaque étape se fait donc par **capture d'écran Playwright** envoyée à l'utilisateur, qui peut aussi lancer le projet chez lui (section ci-dessus).

Dans le conteneur : `service postgresql start`, base `threadify`, utilisateur `postgres` / mot de passe `postgres`. Tout ce qui n'est pas poussé sur GitHub est perdu à la fin de la session : committer et pousser à chaque étape.

## État d'avancement

- [x] Étape 0 — Initialisation du projet (Next.js + Tailwind + Prisma + PostgreSQL) — validée le 2026-11-03
- [x] Étape 1 — Authentification avec Better Auth (inscription, connexion, déconnexion) — validée le 2026-11-05
- [ ] Étape 2 — Écran de saisie (idée ou article collé) et choix du format — **codée et testée par Claude (commit `a603d7c`), en attente de validation par l'utilisateur**
- [ ] Étape 3 — Génération IA du contenu (slides / tweets)
- [ ] Étape 4 — Éditeur de carrousel (templates, couleurs, polices)
- [ ] Étape 5 — Export (PNG / PDF / texte)
- [ ] Étape 6 — Tableau de bord des créations sauvegardées

## Reprise — prochaine étape (point au 2026-11-05)

- Étapes 0 et 1 validées. Étape 1 validée par l'utilisateur sans problème signalé (le piège « engine » de npm 11.20 ne s'est pas manifesté, ou a été résolu avec le guide).
- **Étape 2 : plan validé, codée, testée par Claude (captures envoyées), poussée (`a603d7c`)**. L'utilisateur doit la tester avec **`docs/tester-etape-2.md`** (nouveau ZIP décompressé **par-dessus** `C:\Users\mehdi\Threadify-main` — le `.env` est conservé —, `npm install`, `npx prisma migrate deploy`, `npm run dev`, parcours de test). À la reprise : demander le résultat ; une fois validée, reporter les décisions/pièges ci-dessous dans le journal, cocher l'étape, puis proposer le plan de l'étape 3 (génération IA : choisir le fournisseur d'IA — question ouverte).

### Décisions et pièges de l'étape 2 (à reporter dans le journal une fois validée)

- Modèle `Creation` (`@@map("creation")`, id `cuid()`, index `[userId, createdAt]`) + enums `SourceType` (IDEE/ARTICLE), `CreationFormat` (CARROUSEL_INSTAGRAM/CARROUSEL_LINKEDIN/THREAD_X), `CreationStatus` (BROUILLON) ; migration `20261105201520_creations`.
- Limites : idée 10–500 caractères, article 200–20 000 ; règles et libellés partagés dans `src/lib/creations.ts` ; validation **côté serveur** dans la Server Action `src/app/creer/actions.ts` (`useActionState` côté client, valeurs saisies renvoyées pour ne rien perdre).
- `/creations/[id]` : requête filtrée par `userId` → `notFound()` pour la création d'un autre compte ; page `src/app/not-found.tsx` en français. Comme `notFound()` est appelé dans un `<Suspense>` (Cache Components), le statut HTTP reste 200 mais le contenu n'est pas exposé.
- « Commencer gratuitement » → `/creer` ; le proxy envoie un visiteur sans session de `/creer` vers `/inscription` ; après inscription → `/creer`, après connexion → `/espace`.
- **Piège** : après connexion/inscription, `router.push()` rejouait une redirection mémorisée par le routeur client (`/creer` → `/inscription` vue avant la connexion) et `router.refresh()` rechargeait `/inscription` que le proxy renvoie vers `/espace` — **solution** : navigation complète `window.location.assign()` après connexion, inscription et déconnexion (exception ESLint commentée dans `sign-out-button.tsx`).
- **Piège chez l'utilisateur** : ZIP décompressé dans un nouveau dossier (`C:\2222\Threadify-main`) sans `.env` → `npm install` échouait au `postinstall` (`PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL`) — solution : copier le `.env` de l'ancien dossier ; et `prisma.config.ts` utilise désormais `process.env.DATABASE_URL` au lieu de `env()` pour que `prisma generate` marche sans `.env`.
- Piège de test : `waitForURL` peut expirer pendant la première compilation d'une page en dev — utiliser `waitUntil: 'commit'` et un délai plus long ; texte « Trop court » = 10 caractères, donc valide.

### Plan proposé — Étape 2 : écran de saisie et choix du format

1. Modèle Prisma `Creation` (id, userId → User avec suppression en cascade, `sourceType` enum IDEE/ARTICLE, `sourceText`, `format` enum CARROUSEL_INSTAGRAM/CARROUSEL_LINKEDIN/THREAD_X, `status` enum BROUILLON (GENERE plus tard), createdAt/updatedAt) + migration `creations`.
2. Page protégée `/creer` : deux onglets « Une idée » (zone courte, 10 à 500 caractères) / « Un article » (zone longue, 200 à 20 000 caractères, compteur), trois cartes cliquables pour le format (avec dimensions : 1080×1350 Instagram, 1080×1350 PDF LinkedIn, thread X), bouton « Continuer ».
3. Server Action `createCreation` : vérifie la session, valide les champs côté serveur (messages en français), enregistre en base, redirige vers `/creations/[id]`.
4. Page `/creations/[id]` (protégée, uniquement pour son propriétaire, sinon page 404) : récapitulatif (format, extrait du texte) + bouton « Générer » désactivé « Disponible à l'étape suivante ».
5. `/espace` : bouton « + Nouvelle création » et liste simple des créations (format, début du texte, date) ; accueil : « Commencer gratuitement » mène à `/creer` si connecté.
6. Import d'article par **URL** : reporté (question ouverte) — collage du texte uniquement.
7. Vérification par captures Playwright (saisie, erreur de validation, récapitulatif, liste dans l'espace, accès refusé à la création d'un autre compte) ; guide utilisateur `docs/` ultra détaillé (nouveau ZIP, `npm install`, `npx prisma migrate deploy`, test) ; mise à jour de ce fichier après validation.

**Poste de l'utilisateur** : Windows 10, terminal `cmd`, Node.js **v26.13.0** / npm **11.20**, projet téléchargé en ZIP (pas de Git), dossier `C:\Users\mehdi\Threadify-main` (hors OneDrive) — **à l'étape 2, ZIP décompressé dans `C:\2222\Threadify-main`** : demander quel dossier est utilisé ; base Supabase via l'adresse « Session pooler ». Débutant complet : voir règle de travail n° 4.

### Au démarrage d'une nouvelle session cloud

- Le conteneur est neuf : `service postgresql start`, puis si besoin `su postgres -c "psql -c \"ALTER USER postgres PASSWORD 'postgres';\" -c 'CREATE DATABASE threadify;'"`.
- Recréer `.env` depuis `.env.example` (non versionné), puis `npm install`.
- Après chaque étape qui modifie le schéma : mettre à jour `docs/lancer-en-local.md` (section « Récupérer une nouvelle version ») avec les commandes à lancer chez l'utilisateur.

## Journal des décisions

> Format : `AAAA-MM-JJ — Décision — Raison`

- 2026-11-03 — Stack imposée : Next.js, Prisma + PostgreSQL, Better Auth, Tailwind — exigence du projet.
- 2026-11-03 — Interface et contenus générés en français par défaut — cible francophone.
- 2026-11-03 — Dépôt GitHub : https://github.com/Mehdiii213/Threadify (branche `main`) — sauvegarde et suivi des étapes.
- 2026-11-03 — Next.js 16 avec `src/`, alias `@/*`, Turbopack et `cacheComponents` conservé (réglage par défaut) — suivre les conventions actuelles du framework.
- 2026-11-03 — Prisma 7.10.1 (stable) plutôt que le tag npm `latest` (8.0.0-rc) — éviter une pré-version.
- 2026-11-03 — Prisma 7 avec l'adaptateur `@prisma/adapter-pg` et le générateur `prisma-client` (sortie `src/generated/prisma`, non versionnée, régénérée via `postinstall`) — configuration recommandée en v7.
- 2026-11-03 — Une seule instance de PrismaClient (`src/lib/prisma.ts`, stockée sur `globalThis` en dev) — éviter d'épuiser les connexions avec le rechargement à chaud.
- 2026-11-03 — Pas de migration à l'étape 0 : schéma vide, première migration avec les tables Better Auth à l'étape 1.
- 2026-11-03 — Vérification des étapes par capture d'écran Playwright — le serveur du conteneur cloud n'est pas joignable depuis le navigateur de l'utilisateur.
- 2026-11-05 — Côté utilisateur, appliquer les migrations avec `npx prisma migrate deploy` (et non `migrate dev`) — les migrations sont créées par Claude ; `deploy` n'a pas besoin de base « shadow », souvent problématique avec Supabase.
- 2026-11-05 — Better Auth **1.7.18** (dernière stable), e-mail + mot de passe (8 à 128 caractères), connexion automatique après inscription, plugin `nextCookies()` en dernier — parcours le plus simple pour le MVP ; Google et vérification d'e-mail reportés.
- 2026-11-05 — Modèles `User`, `Session`, `Account`, `Verification` écrits à la main d'après `getAuthTables()` de `better-auth/db`, tables en minuscules via `@@map` (migration `20261105192537_init_auth`) — le paquet `@better-auth/cli` est resté en 1.4, en retard sur `better-auth` 1.7.
- 2026-11-05 — Pages protégées : `src/proxy.ts` redirige selon la seule présence du cookie (rapide), la vraie vérification se fait côté serveur avec `requireSession()` dans un `<Suspense>` — un cookie peut être expiré ou falsifié ; Cache Components impose le `<Suspense>`.
- 2026-11-05 — Formulaires d'auth côté client avec `authClient` (`better-auth/react`), erreurs traduites par code (`src/lib/auth-errors.ts`) — Better Auth renvoie des messages en anglais.
- 2026-11-05 — Projet de l'utilisateur déplacé hors de OneDrive (`C:\Users\mehdi\Threadify-main`) — installation 9 min dans OneDrive.
- 2026-11-05 — Guides utilisateur ultra détaillés dans `docs/` (description de la fenêtre cmd, écrans attendus) — l'utilisateur débute complètement.
- 2026-11-05 — Base de l'utilisateur en local : **Supabase** (uniquement la base PostgreSQL, pas Supabase Auth), via l'adresse **Session pooler** (port 5432, compatible IPv4) — compte Supabase déjà existant ; la « Direct connection » exige l'IPv6.

## Pièges rencontrés

> Format : `Problème — Cause — Solution`

- `npm install prisma@latest` installe une pré-version 8.0.0-rc — le tag `latest` de Prisma pointe vers une RC — installer explicitement `prisma@7.10.1` et `@prisma/client@7.10.1` (mêmes versions pour CLI, client et adaptateur).
- `prisma init` crée `prisma7.config.ts` et ignore l'option `--url` — comportement de la CLI 7.10 — renommer en `prisma.config.ts` et écrire `DATABASE_URL` à la main dans `.env`.
- `prisma init` ajoute des dossiers de skills d'agents (`.agents/`, `.claude/`, `.windsurf/`, `skills-lock.json`) — installation automatique de `prisma/skills` — supprimés, non demandés.
- Prisma 7 ne charge plus `.env` automatiquement — nouveau fonctionnement — `import "dotenv/config"` dans `prisma.config.ts` ; Next.js charge `.env` lui-même pour l'app.
- Erreur de rendu si on lit la base hors `<Suspense>` — `cacheComponents` exige que les données de requête soient isolées — placer le composant dans `<Suspense>` et appeler `await connection()` (de `next/server`) avant la requête.
- `Cannot find name 'LayoutProps'` avec `tsc` — types de routes générés par Next — lancer `npx next typegen` (ou `npm run dev`) avant `tsc --noEmit`.
- `.env.example` ignoré par git — le `.gitignore` de Next contient `.env*` — ajout de l'exception `!.env.example`.
- `localhost:3000` inaccessible pour l'utilisateur — le serveur tourne dans le conteneur cloud — captures Playwright, ou lancer le projet en local. Selon l'application Claude, un aperçu peut aussi s'afficher : lancer `npm run dev` et signaler le port 3000 avec l'outil d'aperçu.
- `npm install` très lent (9 min) chez l'utilisateur — dossier du projet dans OneDrive, qui synchronise `node_modules` — fonctionne quand même ; en cas d'erreur `EPERM`/`EBUSY`, déplacer le projet hors de OneDrive (ex. `C:\Users\mehdi\`).
- Avertissement npm 11.20+ `install-scripts … not yet covered by allowScripts` pour `prisma` et `@prisma/engines` — npm bloque désormais les scripts d'installation des dépendances — le site fonctionne (le `postinstall` du projet lui-même s'exécute) ; si `prisma migrate` réclame un moteur manquant à l'étape 1 : `npm install-scripts approve prisma @prisma/engines` puis `npm install`. Rien de signalé lors de l'étape 1 chez l'utilisateur.
- `copy .env.example .env` relancé plusieurs fois écrase le `.env` déjà rempli — Windows demande « Remplacer ? » — ne copier qu'une fois, puis modifier avec `notepad .env`.
- Next.js 16 : le fichier `middleware.ts` est déprécié — renommé `proxy` — créer `src/proxy.ts` exportant `proxy()` et un `matcher`.
- `@better-auth/cli generate` en retard de version (1.4 vs 1.7) — publication séparée du CLI — générer le schéma Prisma à la main à partir de `getAuthTables()`.
- Test Playwright : `getByRole('alert')` capture l'annonceur de route de Next.js (qui contient le titre de la page) — cibler `form [role=alert]`.
- Première capture prise pendant la compilation (« Un instant… » / « Compiling ») — premier rendu lent en dev — attendre un élément précis avant la capture.
- Mot de passe Supabase avec caractères spéciaux (`@ # / ? %`) — ils cassent l'URL de connexion — utiliser uniquement lettres et chiffres (ou les encoder en URL).

## Questions ouvertes

- Fournisseur d'IA pour la génération (à décider à l'étape 3).
- Méthode d'export des carrousels (rendu côté serveur ou côté client).
- Import d'article par URL (scraping) dans le MVP ou plus tard ?
- Modèle de monétisation (freemium, quotas de générations).
