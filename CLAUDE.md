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
4. **Après chaque étape validée, mettre à jour ce CLAUDE.md** :
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
npx prisma migrate dev              # applique les migrations (à partir de l'étape 1)
npm run dev
```

Puis ouvrir http://localhost:3000. Après chaque étape validée : `git pull`, `npm install`, `npx prisma migrate dev`.

## Environnement de développement de Claude (session cloud)

Claude travaille dans un conteneur cloud temporaire : `localhost:3000` n'y est **pas accessible** depuis le navigateur de l'utilisateur. La vérification visible de chaque étape se fait donc par **capture d'écran Playwright** envoyée à l'utilisateur, qui peut aussi lancer le projet chez lui (section ci-dessus).

Dans le conteneur : `service postgresql start`, base `threadify`, utilisateur `postgres` / mot de passe `postgres`. Tout ce qui n'est pas poussé sur GitHub est perdu à la fin de la session : committer et pousser à chaque étape.

## État d'avancement

- [x] Étape 0 — Initialisation du projet (Next.js + Tailwind + Prisma + PostgreSQL) — validée le 2026-11-03
- [ ] Étape 1 — Authentification avec Better Auth (inscription, connexion, déconnexion)
- [ ] Étape 2 — Écran de saisie (idée ou article collé) et choix du format
- [ ] Étape 3 — Génération IA du contenu (slides / tweets)
- [ ] Étape 4 — Éditeur de carrousel (templates, couleurs, polices)
- [ ] Étape 5 — Export (PNG / PDF / texte)
- [ ] Étape 6 — Tableau de bord des créations sauvegardées

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

## Pièges rencontrés

> Format : `Problème — Cause — Solution`

- `npm install prisma@latest` installe une pré-version 8.0.0-rc — le tag `latest` de Prisma pointe vers une RC — installer explicitement `prisma@7.10.1` et `@prisma/client@7.10.1` (mêmes versions pour CLI, client et adaptateur).
- `prisma init` crée `prisma7.config.ts` et ignore l'option `--url` — comportement de la CLI 7.10 — renommer en `prisma.config.ts` et écrire `DATABASE_URL` à la main dans `.env`.
- `prisma init` ajoute des dossiers de skills d'agents (`.agents/`, `.claude/`, `.windsurf/`, `skills-lock.json`) — installation automatique de `prisma/skills` — supprimés, non demandés.
- Prisma 7 ne charge plus `.env` automatiquement — nouveau fonctionnement — `import "dotenv/config"` dans `prisma.config.ts` ; Next.js charge `.env` lui-même pour l'app.
- Erreur de rendu si on lit la base hors `<Suspense>` — `cacheComponents` exige que les données de requête soient isolées — placer le composant dans `<Suspense>` et appeler `await connection()` (de `next/server`) avant la requête.
- `Cannot find name 'LayoutProps'` avec `tsc` — types de routes générés par Next — lancer `npx next typegen` (ou `npm run dev`) avant `tsc --noEmit`.
- `.env.example` ignoré par git — le `.gitignore` de Next contient `.env*` — ajout de l'exception `!.env.example`.
- `localhost:3000` inaccessible pour l'utilisateur — le serveur tourne dans le conteneur cloud — captures Playwright, ou lancer le projet en local.

## Questions ouvertes

- Fournisseur d'IA pour la génération (à décider à l'étape 3).
- Méthode d'export des carrousels (rendu côté serveur ou côté client).
- Import d'article par URL (scraping) dans le MVP ou plus tard ?
- Modèle de monétisation (freemium, quotas de générations).
