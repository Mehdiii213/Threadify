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
- PostgreSQL **16**, Node.js 22

> Next.js 16 a des API différentes des versions précédentes : consulter `node_modules/next/dist/docs/` avant d'écrire du code (voir `AGENTS.md`).

## Structure du projet

```
prisma/schema.prisma        # schéma (générateur `prisma-client`, sortie dans src/generated/prisma)
prisma.config.ts            # config Prisma 7 : chemin du schéma, migrations, DATABASE_URL
src/app/                    # routes App Router (layout.tsx, page.tsx, globals.css)
src/components/             # composants partagés (ex. db-status.tsx)
src/lib/prisma.ts           # instance unique de PrismaClient (à importer partout)
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
- [ ] Étape 1 — Authentification avec Better Auth (inscription, connexion, déconnexion) — **codée et testée par Claude (commit `09aed71`), en attente de validation par l'utilisateur**
- [ ] Étape 2 — Écran de saisie (idée ou article collé) et choix du format
- [ ] Étape 3 — Génération IA du contenu (slides / tweets)
- [ ] Étape 4 — Éditeur de carrousel (templates, couleurs, polices)
- [ ] Étape 5 — Export (PNG / PDF / texte)
- [ ] Étape 6 — Tableau de bord des créations sauvegardées

## Reprise — prochaine étape (point au 2026-11-05)

- Étape 0 validée ; le projet a tourné chez l'utilisateur avec Supabase (pastille verte).
- **Étape 1 codée, testée par Claude (captures Playwright envoyées), poussée (`09aed71`)**. L'utilisateur doit la tester chez lui en suivant **`docs/mettre-a-jour.md`** (guide ultra détaillé : nouveau ZIP décompressé dans `C:\Users\mehdi\Threadify-main` hors OneDrive, copie de l'ancien `.env`, ajout de `BETTER_AUTH_SECRET` / `BETTER_AUTH_URL`, `npm install`, `npx prisma migrate deploy`, `npm run dev`, test du parcours).
- **À la reprise** : demander où en est le test (captures à l'appui), aider en cas de blocage — point à surveiller : erreur « engine » au `migrate deploy` (npm 11.20 bloque les scripts d'installation de Prisma, solution dans le guide). Une fois l'étape 1 **validée par l'utilisateur** : mettre à jour ce fichier (étape cochée, décisions, pièges ci-dessous), puis proposer le plan de l'étape 2.

**Poste de l'utilisateur** : Windows 10, terminal `cmd`, Node.js **v26.13.0** / npm **11.20**, projet téléchargé en ZIP (pas de Git) ; ancien dossier `C:\Users\mehdi\OneDrive\Bureau\Threadify-main`, nouveau dossier conseillé `C:\Users\mehdi\Threadify-main` ; base Supabase via l'adresse « Session pooler ». Débutant complet : voir règle de travail n° 4.

### Décisions et pièges de l'étape 1 (à reporter dans le journal une fois validée)

- Better Auth **1.7.18** (dernière stable), e-mail + mot de passe (8 à 128 caractères), connexion automatique après inscription, plugin `nextCookies()` en dernier.
- Modèles Prisma `User`, `Session`, `Account`, `Verification` écrits à la main d'après `getAuthTables()` de `better-auth/db` (le paquet `@better-auth/cli` est resté en 1.4, en retard sur `better-auth` 1.7) ; tables en minuscules via `@@map`. Migration `20261105192537_init_auth`.
- Protection des pages : `src/proxy.ts` (le `middleware` s'appelle désormais `proxy` en Next.js 16) redirige selon la seule **présence** du cookie ; la vraie vérification se fait côté serveur avec `requireSession()` (`src/lib/session.ts`), dans un `<Suspense>` (Cache Components).
- Formulaires côté client avec `authClient` (`better-auth/react`) ; messages d'erreur traduits par code dans `src/lib/auth-errors.ts`.
- Piège de test Playwright : `getByRole('alert')` attrape aussi l'annonceur de route de Next.js (qui contient le titre de la page) → cibler `form [role=alert]`.

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
- Avertissement npm 11.20+ `install-scripts … not yet covered by allowScripts` pour `prisma` et `@prisma/engines` — npm bloque désormais les scripts d'installation des dépendances — le site fonctionne (le `postinstall` du projet lui-même s'exécute) ; si `prisma migrate` réclame un moteur manquant à l'étape 1 : `npm install-scripts approve prisma @prisma/engines` puis `npm install`. **À vérifier lors de l'étape 1.**
- `copy .env.example .env` relancé plusieurs fois écrase le `.env` déjà rempli — Windows demande « Remplacer ? » — ne copier qu'une fois, puis modifier avec `notepad .env`.
- Mot de passe Supabase avec caractères spéciaux (`@ # / ? %`) — ils cassent l'URL de connexion — utiliser uniquement lettres et chiffres (ou les encoder en URL).

## Questions ouvertes

- Fournisseur d'IA pour la génération (à décider à l'étape 3).
- Méthode d'export des carrousels (rendu côté serveur ou côté client).
- Import d'article par URL (scraping) dans le MVP ou plus tard ?
- Modèle de monétisation (freemium, quotas de générations).
