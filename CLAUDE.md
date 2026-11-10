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
4. **Expliquer chaque étape à l'utilisateur comme à un débutant complet** (ne connaît rien au code) : guide pas à pas, clic par clic, en **décrivant la fenêtre noire (cmd)** — son titre, l'invite `C:\2222\Threadify-main>`, ce qui s'affiche, comment savoir qu'une commande est terminée — ainsi que chaque écran du navigateur attendu (✅). Sauvegarder ce guide dans `docs/` (modèle : `docs/mettre-a-jour.md`).
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
- `@anthropic-ai/sdk` **1.6.0**, zod **4.6.7** (modèle `claude-opus-5-5`)
- Export : `modern-screenshot` **4.7.0**, `jszip` **3.10.2**, `jspdf` **4.2.1**
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
src/lib/generation.ts       # appel à Claude, consignes par format, schémas JSON, erreurs FR
src/lib/content.ts          # forme du contenu (slides/tweets), limites — partagé client/serveur
src/lib/design.ts           # modèles, palettes, polices, signature, contraste — partagé
src/lib/fonts.ts            # polices des slides (next/font/google)
src/components/slide.tsx    # slide 1080×1350 + miniature (réutilisée pour l'export)
src/components/carousel-editor.tsx, thread-editor.tsx  # éditeurs (client)
src/app/creations/[id]/actions.ts  # Server Action generateCreation
src/lib/export.ts           # export navigateur : PNG (modern-screenshot), ZIP (jszip), PDF (jspdf), .txt
src/lib/organisation.ts     # titres affichés, étiquettes, limites (dossiers, pages)
src/lib/plans.ts, billing.ts, stripe.ts, admin.ts  # offres, quotas, Stripe, administration
src/app/tarifs/, src/app/abonnement/, src/app/admin/couts/  # pages de l'étape 7
src/lib/email.ts            # e-mails (API Resend via fetch ; sans clé : lien affiché dans la console)
src/lib/legal.ts, site.ts   # infos légales à compléter + régime de TVA ; adresse publique du site
src/app/compte/, mot-de-passe-oublie/, nouveau-mot-de-passe/, compte-supprime/  # compte (étape 8a)
src/app/mentions-legales/, cgv/, confidentialite/  # pages légales (modèles, src/components/legal-page.tsx)
src/app/robots.ts, sitemap.ts, opengraph-image.tsx, icon.svg  # référencement et aperçu de partage
src/components/password-forms.tsx, site-footer.tsx  # formulaires de compte, pied de page
src/app/espace/actions.ts   # actions du tableau de bord (dossiers, étiquettes, dupliquer, supprimer…)
src/components/dashboard/   # menu de carte, navigation des dossiers
src/components/organisation-panel.tsx  # titre / dossier / étiquettes d'une création
docs/                       # guides pas à pas pour l'utilisateur (lancer-en-local, mettre-a-jour, tester-etape-2 à 7, tester-etape-8a)
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
- [x] Étape 2 — Écran de saisie (idée ou article collé) et choix du format — validée le 2026-11-06
- [x] Étape 3 — Génération IA du contenu (slides / tweets) — validée le 2026-11-06
- [x] Étape 4 — Éditeur de carrousel (templates, couleurs, polices) — validée le 2026-11-06
- [x] Étape 5 — Export (PNG / PDF / texte) — validée le 2026-11-09
- [x] Étape 6 — Tableau de bord des créations sauvegardées (+ titres, dossiers, étiquettes) — validée le 2026-11-09 — **MVP complet**
- [x] Étape 7 — Abonnement mensuel (Stripe) : Gratuit 3/mois + filigrane, Pro 12 € 100/mois, Expert 19 € illimité (100/jour, 30/heure), quotas, page cachée `/admin/couts` — validée le 2026-11-10
- [ ] Étape 8 — **8a codée le 2026-11-10, en test chez l'utilisateur** (`docs/tester-etape-8a.md`) ; 8b et 8c à faire — Mise en ligne : hébergement, base de production, vraie adresse web, vérification d'e-mail, pages légales (mentions légales, CGV, confidentialité/RGPD)

## Reprise — prochaine étape (point au 2026-11-10)

- **Étapes 0 à 7 validées** (étape 7 validée le 2026-11-10 après test chez l'utilisateur : tarifs, filigrane, paiement test, portail + résiliation corrigée, page `/admin/couts`).
- **Étape 8 — mise en ligne** : l'utilisateur a dit « commençons par l'étape 8a » (2026-11-10) → **8a codée, poussée, à tester chez lui** avec `docs/tester-etape-8a.md`. Restent en attente de ses réponses : (1) hébergeur et budget (Vercel + Supabase proposés), (2) nom de domaine, (3) statut juridique et TVA → à reporter dans `src/lib/legal.ts` (`editor`, `vatRegime`, `mediator`), (4) création du compte Resend (8b). Les valeurs `[…]` des pages légales sont surlignées en jaune tant qu'elles ne sont pas remplies.

### Plan proposé — Étape 8 : mise en ligne (en 3 sous-étapes, chacune vérifiée)

- **8a — Préparer le site (code)** : vérification de l'adresse e-mail à l'inscription + **« Mot de passe oublié »** (Better Auth `sendVerificationEmail` / `sendResetPassword`) via un service d'e-mails transactionnels (**Resend** proposé, gratuit jusqu'à 3 000 e-mails/mois — nouvelle dépendance à valider) ; **« Supprimer mon compte »** (droit à l'effacement RGPD, résiliation Stripe incluse) ; **pages légales** (mentions légales, CGV/CGU, politique de confidentialité : données collectées, sous-traitants Anthropic / Stripe / Supabase / hébergeur ; cookies uniquement nécessaires → pas de bandeau) rédigées en modèles à compléter par l'utilisateur — pas un avis juridique, relecture conseillée ; pied de page avec liens ; titre/description/aperçu de partage (Open Graph), favicon, `robots.txt`, `sitemap.xml` ; limitation du nombre de tentatives de connexion ; paramètre de TVA de la page des coûts (0 % si franchise en base).
- **8b — Mettre en ligne** : hébergeur recommandé **Vercel** (fait pour Next.js, déploiement automatique à chaque mise à jour GitHub ; l'offre gratuite « Hobby » interdit l'usage commercial → offre Pro ~20 $/mois au lancement payant) ; **base Supabase de production** séparée (région UE ; l'offre gratuite se met en pause après inactivité → Pro ~25 $/mois conseillé au lancement) ; **nom de domaine** (ex. threadify.fr, ~10 €/an) relié à Vercel avec HTTPS ; variables de production (nouvelle `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` = vraie adresse, clé Anthropic avec **plafond de dépenses** dans la console) ; `prisma migrate deploy` sur la base de production. Vérification : le site s'ouvre sur la vraie adresse depuis l'ordinateur et le téléphone.
- **8c — Activer les vrais paiements** : activation du compte Stripe (statut d'entreprise / SIRET, IBAN), produits Pro et Expert **en mode réel**, clés `sk_live_…`, **webhook** `https://<domaine>/api/auth/stripe/webhook` (abonnements créés / modifiés / supprimés, `STRIPE_WEBHOOK_SECRET`), portail client réel, choix sur « Adaptive Pricing ». Vérification : un vrai abonnement payé puis remboursé/résilié.

**Poste de l'utilisateur** : Windows 10, terminal `cmd`, Node.js **v26.13.0** / npm **11.20**, projet téléchargé en ZIP (pas de Git), dossier actuel **`C:\2222\Threadify-main`** (hors OneDrive ; les prochains ZIP sont à décompresser **par-dessus**, destination `C:\2222`, pour conserver le `.env`) ; base Supabase via l'adresse « Session pooler ». Débutant complet : voir règle de travail n° 4.

### Au démarrage d'une nouvelle session cloud

- Si la session tourne sur l'environnement **« Threadify »**, son script de préparation a normalement déjà tout fait (vérifier : `service postgresql status`, présence de `.env`). Pour Stripe : ajouter au `.env` du conteneur `STRIPE_SECRET_KEY="sk_test_remplace_par_le_proxy"`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_EXPERT` (voir plus haut), `ADMIN_EMAILS="admin.test@exemple.fr"`, et lancer `NODE_USE_ENV_PROXY=1 npm run dev`. Sinon :
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
- 2026-11-05 — Modèle `Creation` (`@@map("creation")`, id `cuid()`, index `[userId, createdAt]`) + enums `SourceType` (IDEE/ARTICLE), `CreationFormat` (CARROUSEL_INSTAGRAM/CARROUSEL_LINKEDIN/THREAD_X), `CreationStatus` (BROUILLON), migration `20261105201520_creations` — base des créations du MVP.
- 2026-11-05 — Limites : idée 10–500 caractères, article 200–20 000 ; règles et libellés partagés dans `src/lib/creations.ts` ; validation côté serveur dans la Server Action `src/app/creer/actions.ts` (`useActionState`, valeurs saisies renvoyées) — sécurité et confort.
- 2026-11-05 — `/creations/[id]` filtré par `userId` → `notFound()` (page 404 en français `src/app/not-found.tsx`) ; dans un `<Suspense>`, le statut HTTP reste 200 mais rien n'est exposé — isolation des données entre comptes.
- 2026-11-05 — « Commencer gratuitement » → `/creer` ; sans session, le proxy renvoie `/creer` vers `/inscription` ; après inscription → `/creer`, après connexion → `/espace` — parcours le plus court vers la première création.
- 2026-11-05 — Navigation complète `window.location.assign()` après connexion, inscription et déconnexion — le routeur client rejouait des redirections mémorisées avant le changement de session.
- 2026-11-05 — Import d'article par URL reporté — collage du texte uniquement pour le MVP.
- 2026-11-05 — `prisma.config.ts` lit `process.env.DATABASE_URL` (et non `env()`) — `npm install` (postinstall `prisma generate`) doit marcher même sans `.env`.
- 2026-11-06 — Dossier du projet chez l'utilisateur : `C:\2222\Threadify-main` ; les nouveaux ZIP se décompressent par-dessus (destination `C:\2222`) pour garder le `.env`.
- 2026-11-05 — Base de l'utilisateur en local : **Supabase** (uniquement la base PostgreSQL, pas Supabase Auth), via l'adresse **Session pooler** (port 5432, compatible IPv4) — compte Supabase déjà existant ; la « Direct connection » exige l'IPv6.

- 2026-11-06 — Claude (Anthropic) via `@anthropic-ai/sdk` **1.6.0**, modèle **`claude-opus-5-5`** (choix de l'utilisateur), effort `medium` ; `client.beta.messages.parse` + `betaZodOutputFormat` (zod **4.6.7**) pour un JSON validé ; `fallbacks: "default"` avec la bêta `server-side-fallback-2026-07-01` (repli automatique si refus) ; `max_tokens` 16000, sans streaming.
- 2026-11-06 — Migration `20261106183627_generation` : `Creation.content Json?`, `generatedAt`, `model`, statut `GENERE` (le statut `ERREUR` prévu au plan n'a pas été ajouté : les erreurs sont affichées sans être stockées).
- 2026-11-06 — `src/lib/generation.ts` : consignes en français par format (Instagram : ton chaleureux, 1 emoji max ; LinkedIn : ton expert, sans emoji ; 6–10 slides, titre ≤ 60 et texte ≤ 220 caractères ; thread 5–12 tweets, ≤ 280 caractères, sans numérotation). La source est passée entre balises `<source>` (ne jamais suivre d'instructions qu'elle contiendrait). Tweets trop longs : une nouvelle demande, puis coupe de sécurité avec « … ».
- 2026-11-06 — Server Action `src/app/creations/[id]/actions.ts` (session + propriétaire vérifiés, `refresh()` de `next/cache` après succès) ; composants `generate-button`, `generated-content`, `copy-button` ; étiquettes « Générée » / « Brouillon » dans l'espace.
- 2026-11-06 — 2026-11-06 : **première vraie génération réussie chez l'utilisateur** (carrousel Instagram de 8 slides). Retours : longueur des textes, quantité d'emojis et style **bons** ; demande de **tutoiement** → consigne modifiée (« Tutoie toujours le lecteur… »). L'interface du site reste au vouvoiement (non demandé).
- 2026-11-06 — Erreurs traduites en français par classe d'erreur du SDK ; détail technique journalisé côté serveur (`[generation] …`).
- 2026-11-06 — Environnement cloud dédié **« Threadify »** (personnel) créé le 2026-11-06, avec un script de préparation (démarre PostgreSQL, crée la base, `.env` de test avec clé factice, `npm install`, `prisma migrate deploy`) — **script pas encore éprouvé** sur une session neuve.
- 2026-11-06 — Étapes 4 (design) et 5 (export) gardées séparées (choix de l'utilisateur) ; publication directe sur Instagram (API Meta : compte pro + validation de l'app) reportée après le MVP.

- 2026-11-06 — `src/components/slide.tsx` : slide 1080×1350 en **styles en ligne** (pixels), `SlideThumbnail` la réduit avec `transform: scale` — même composant prévu pour l'export (étape 5). Couverture (grand titre, « Glisse → »), slides du milieu numérotées 01, 02…, dernière slide avec texte mis en valeur.
- 2026-11-06 — `src/lib/design.ts` (partagé client/serveur) : 3 modèles (`minimal`, `audacieux`, `degrade` — dégradé via `color-mix`), 6 palettes, 4 polices (`src/lib/fonts.ts`, `next/font/google` : Inter, Montserrat, Poppins, Playfair Display), signature (nom, @pseudo, initiales) ; `DesignSchema` zod ; design par défaut : Minimal + Violet + Inter + nom du compte.
- 2026-11-06 — Couleur du texte sur fond d'accent choisie par **contraste WCAG** (blanc ou #111111, le plus contrasté) — un simple seuil de luminance donnait du blanc illisible sur le bleu clair de la palette Nuit.
- 2026-11-06 — `src/lib/content.ts` : schémas et limites du contenu partagés client/serveur (`generation.ts` reste `server-only` et réexporte). Limites : 15 slides, titre 120, texte 500 ; 25 tweets ≤ 280.
- 2026-11-06 — Éditeurs client `carousel-editor.tsx` et `thread-editor.tsx` : aperçu en direct, ↑ ↓, ajout (avant la dernière slide), suppression, bouton Enregistrer (Server Actions `saveCarousel` / `saveThread` validées par zod, propriétaire vérifié), avertissement `beforeunload` si non enregistré. `key={generatedAt}` pour repartir des nouveaux textes après une génération.
- 2026-11-06 — « Régénérer » demande confirmation (`window.confirm`) car il remplace les textes modifiés ; le design est conservé. Migration `20261106195716_design` (`Creation.design Json?`).
- 2026-11-06 : retour de l'utilisateur après test chez lui (« j'apprécie ») → la pastille de la signature affiche **une seule initiale** (première lettre du nom, sinon du @pseudo ; accents gérés), police agrandie de 32 à 40 px. Fonction `initial()` dans `design.ts` (remplace `initials()`).
- 2026-11-06 — Interface au vouvoiement, contenus des slides au tutoiement (« Glisse → », « Ton texte ici. »).
- 2026-11-06 — Feuille de route complétée : étape 7 abonnement mensuel (après le MVP complet : on fait payer un produit qui permet d'exporter), étape 8 mise en ligne. Côté utilisateur à préparer : statut d'entreprise (SIRET) et compte bancaire pour Stripe, choix des offres et prix, documents légaux.

- 2026-11-08 — Export **dans le navigateur** : `src/lib/export.ts` (`modern-screenshot` 4.7.0 `domToCanvas`, `jszip` 3.10.2, `jspdf` 4.2.1, chargés par `import()` au clic) ; chaque slide affichée porte `data-slide-root` et est capturée à 1080×1350 (`scale: 1`) après `document.fonts.ready` — polices `next/font` et dégradés `color-mix` rendus fidèlement (vérifié sur les fichiers).
- 2026-11-08 — ZIP `threadify-<titre>.zip` avec `slide-01.png`… (~1 Mo par image) ; PDF `jsPDF({ unit: "px", format: [1080, 1350], hotfixes: ["px_scaling"] })`, images JPEG 0,92 (PDF ~0,5 Mo pour 5 pages, MediaBox 810×1012,5 pt = 4:5) ; slide seule en PNG ; thread en `.txt` (tweets numérotés séparés par `---`). Noms de fichiers via `slugify()` du premier titre.
- 2026-11-08 — Bouton principal selon le format (ZIP pour Instagram, PDF pour LinkedIn), les deux toujours proposés ; l'export reprend l'état **affiché** de l'éditeur (rappel d'enregistrer si modifications en cours).
- 2026-11-09 — Étape 5 validée par l'utilisateur après test chez lui (ZIP / PDF / .txt).

- 2026-11-09 — Migration `20261109101118_organisation` : `Creation.title String?` (titre choisi ; sinon `displayTitle()` le déduit : 1re slide, 1er tweet ou extrait du texte), `Creation.folderId` → modèle `Folder` (`@@unique([userId, name])`, `onDelete: SetNull` : supprimer un dossier garde ses créations), `Creation.tags String[]` (≤ 10 étiquettes de ≤ 30 caractères, dédoublonnées sans tenir compte des majuscules, « # » retiré — `normalizeTags()`), index `[userId, folderId]`. Choix : **dossier = un seul par création (client)**, **étiquettes = plusieurs (thèmes)**.
- 2026-11-09 — `src/lib/organisation.ts` (partagé) : limites (titre 80, dossier 40, 50 dossiers, 12 par page), `displayTitle`, `normalizeTags`. `src/app/espace/actions.ts` : `renameCreation`, `moveCreation`, `setCreationTags`, `duplicateCreation` (copie texte + design + dossier + étiquettes, titre « … (copie) »), `deleteCreation`, `createFolder`, `renameFolder`, `deleteFolder` — session + propriétaire vérifiés, `refresh()` après succès.
- 2026-11-09 — `/espace` : filtres dans l'adresse (`?dossier=<id>|aucun&format=instagram|linkedin|thread&statut=generee|brouillon&etiquette=…&q=…&page=…`), lus sous `<Suspense>` ; recherche insensible à la casse dans le titre et le texte de départ (pas dans le contenu généré, stocké en JSON) ; « Générées ce mois-ci » = créations dont `generatedAt` ≥ 1er du mois (une régénération ne compte pas en plus — un vrai compteur sera nécessaire pour les quotas de l'étape 7).
- 2026-11-09 — Composants : `dashboard/card-menu.tsx` (menu `<details>` « ⋯ », `window.prompt` / `window.confirm`), `dashboard/folder-nav.tsx`, `organisation-panel.tsx` (titre enregistré à la sortie du champ, dossier à la sélection, étiquettes avec suggestions `<datalist>`). Le titre de la page d'une création est désormais le titre affiché (format en sous-titre).
- 2026-11-09 — Étape 6 validée par l'utilisateur : le MVP (parcours 1 à 7 du produit) est complet.

- 2026-11-09 — `stripe` 23.1.0 + `@better-auth/stripe` 1.7.18 ; plugin activé **seulement si `STRIPE_SECRET_KEY` est défini** (`src/lib/stripe.ts` : client unique ou `null`) ; plans `pro` / `expert` liés aux prix `STRIPE_PRICE_PRO` / `STRIPE_PRICE_EXPERT` ; `createCustomerOnSignUp`. Client : `stripeClient({ subscription: true })`, `authClient.subscription.upgrade({ plan, successUrl, cancelUrl, locale: "fr" })`, `authClient.subscription.billingPortal({ returnUrl })`.
- 2026-11-09 — **Pas besoin de webhooks pour l'activation** : l'endpoint `/api/auth/subscription/success` du plugin relit la session Checkout et l'abonnement chez Stripe. Résiliations / renouvellements : `syncSubscriptionFromStripe()` à chaque visite de `/abonnement` (dates de période lues sur `items.data[0].current_period_*`) — évite la Stripe CLI en local ; webhooks à configurer à l'étape 8 (`/api/auth/stripe/webhook`, `STRIPE_WEBHOOK_SECRET`).
- 2026-11-09 — Migrations `20261109103313_abonnements` (table `subscription` du plugin, `user.stripeCustomerId`, table `generation_event`) et `20261109104446_couts` (`model`, `inputTokens`, `outputTokens`, `costUsd` sur `generation_event`).
- 2026-11-09 — Quotas (`src/lib/billing.ts`, `src/lib/plans.ts`) : mois calendaire ; chaque génération **réussie** (y compris régénération) crée un `GenerationEvent` ; vérification **avant** l'appel à Claude ; Gratuit 3, Pro 100, Expert illimité avec garde-fous 100/jour et 30/heure ; message + lien « Voir les offres » quand le quota est atteint.
- 2026-11-09 — Coût réel : `usageOf()` dans `generation.ts` (tarifs $/MTok par modèle : opus-5-5 4/20, opus-5 et opus-4-8 5/25, sonnet-5-5 2/10, haiku-5-5 0,1/0,5 ; cache écrit ×1,25, lu ×0,1 ; réflexion incluse dans les tokens de sortie) ; un thread redemandé additionne les deux appels. Estimation : 3 à 9 centimes par génération ; client Pro à 100 générations ≈ 3 à 9 €/mois de coût IA.
- 2026-11-09 — `/admin/couts` : accès si l'e-mail du compte figure dans `ADMIN_EMAILS` (`.env`, jamais dans le code) ; sinon (non connecté compris) `notFound()` ; `robots: noindex` ; aucun lien dans le site ; mois navigables (`?mois=AAAA-MM`) ; revenus nets = prix TTC − TVA 20 % − frais Stripe estimés (1,5 % + 0,25 €) ; conversion `USD_EUR_RATE` (0,92 par défaut).
- 2026-11-09 — Tests Stripe réalisés par Claude : client Stripe créé à l'inscription ✅ ; « Passer à Pro » crée la session Checkout ✅ (page checkout.stripe.com affichée) ; abonnement Pro créé via l'API (`pm_card_visa`) puis affiché par Threadify (12 €, renouvellement, 0 / 100, « Votre offre actuelle ») ✅ ; bouton portail → billing.stripe.com ✅ ; résiliation (`cancel_at_period_end`) prise en compte par `syncSubscriptionFromStripe` ✅. **Non testable dans le cloud** : saisie de carte sur Checkout et affichage du portail (voir piège proxy) → à tester chez l'utilisateur.
- 2026-11-09 — Filigrane « Fait avec Threadify » (prop `watermark` de `Slide`, en haut à droite) sur l'aperçu et l'export de l'offre Gratuite. Pages `/tarifs` (publique) et `/abonnement` (protégée par le proxy) ; lien « Tarifs » dans l'en-tête ; case « Générations ce mois-ci · offre … » dans l'espace.
- 2026-11-10 — Étape 7 validée par l'utilisateur après test chez lui (paiement test, portail, résiliation, page des coûts).

- 2026-11-10 — 8a : e-mails via l'**API REST de Resend appelée avec `fetch`** (`src/lib/email.ts`, aucune dépendance npm ajoutée) ; variables `RESEND_API_KEY`, `EMAIL_FROM` (défaut `Threadify <onboarding@resend.dev>`, qui n'envoie qu'à l'adresse du compte Resend). **Sans clé : l'e-mail n'est pas envoyé, son lien s'affiche dans la console** (`[e-mail] … Lien : …`) — permet de tout tester en local. Un échec d'envoi est journalisé, jamais bloquant.
- 2026-11-10 — Vérification d'adresse **souple** : `emailVerification.sendOnSignUp`, lien valable 24 h, `autoSignInAfterVerification`, retour sur `/espace?email=confirme` ; le compte reste utilisable (pas de `requireEmailVerification`, qui aurait bloqué les comptes existants), mais **`generateCreation` refuse tant que `emailVerified` est faux** (l'IA coûte ; évite les fausses adresses pour multiplier les quotas gratuits). Bandeau jaune dans `SiteHeader` tant que l'adresse n'est pas confirmée.
- 2026-11-10 — Mot de passe oublié : `/mot-de-passe-oublie` → `authClient.requestPasswordReset({ redirectTo: /nouveau-mot-de-passe })` → lien 1 h, usage unique → `/nouveau-mot-de-passe?token=` (ou `?error=INVALID_TOKEN`) ; `revokeSessionsOnPasswordReset`. `/compte` : infos, renvoi de l'e-mail, changement de mot de passe (`revokeOtherSessions`), suppression.
- 2026-11-10 — Suppression de compte : `user.deleteUser` avec **mot de passe + mot SUPPRIMER** ; `beforeDelete` résilie **immédiatement** les abonnements Stripe (`subscriptions.cancel`, factures conservées chez Stripe) et supprime les lignes `subscription` ; si Stripe échoue (sauf `resource_missing`), la suppression est annulée (`STRIPE_CANCEL_FAILED`). Créations, dossiers, sessions : cascade. **`GenerationEvent.userId` devient optionnel (`onDelete: SetNull`)** pour garder l'historique des coûts, anonyme (« (compte supprimé) » sur `/admin/couts`). Migration `20261110152845_securite` (+ table `rate_limit`).
- 2026-11-10 — Limitation des tentatives Better Auth stockée **en base** (`rateLimit.storage: "database"`, fonctionne avec plusieurs serveurs) : connexion 5 / 5 min, inscription 5 / h, mot de passe oublié et renvoi d'e-mail 3 / 15 min, suppression 5 / 5 min ; **active seulement en production** (vérifié avec `next build` + `next start` : 429, `x-retry-after: 300`).
- 2026-11-10 — Pages légales en **modèles** (`/mentions-legales`, `/cgv` = CGU + CGV, `/confidentialite`) alimentées par `src/lib/legal.ts` ; valeurs `[…]` surlignées (`<Fill>`). Rétractation : 14 jours avec remboursement au prorata (L221-25) ; sous-traitants Vercel, Supabase (UE), Anthropic, Stripe, Resend ; cookies strictement nécessaires → pas de bandeau. `vatRegime` (`tva20` par défaut / `franchise`) pilote la mention sous les tarifs et la TVA de `/admin/couts`. Mention d'acceptation des CGU sous le formulaire d'inscription.
- 2026-11-10 — Finitions : pied de page (`SiteFooter` dans le layout), titres `"%s — Threadify"` (template du layout ; les pages ne mettent plus « — Threadify »), `metadataBase` = `BETTER_AUTH_URL`, Open Graph `fr_FR`, `opengraph-image.tsx` (1200×630), `icon.svg` (remplace `favicon.ico`), `robots.ts` (pages privées exclues) et `sitemap.ts` (pages publiques), `robots: { index: false }` sur les pages privées.

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
- Après connexion/inscription, `router.push()` rejouait une redirection mémorisée (`/creer` → `/inscription`) et `router.refresh()` rechargeait `/inscription`, renvoyée vers `/espace` par le proxy — cache du routeur client — navigation complète `window.location.assign()` (exception ESLint commentée dans `sign-out-button.tsx`).
- `npm install` échouait au postinstall avec `PrismaConfigEnvError: Cannot resolve environment variable: DATABASE_URL` — ZIP décompressé dans un nouveau dossier sans `.env` — copier/recréer le `.env` ; `prisma.config.ts` utilise désormais `process.env`.
- `P1013: The provided database string is invalid. The scheme is not recognized` — ligne `DATABASE_URL` mal formée (texte avant `postgresql://`, ligne en double) — réécrire la ligne ; diagnostic sans montrer le mot de passe : `node -e "require('dotenv').config();const u=process.env.DATABASE_URL||'';console.log(JSON.stringify(u.replace(/:[^:@\/]*@/,':****@')))"`.
- Ancien dossier supprimé par erreur → `.env` perdu — il n'est jamais dans le ZIP — `copy .env.example .env`, adresse Supabase (Connect → Session pooler), nouvelle clé `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` ; les comptes restent dans Supabase, seule la session est perdue.
- Test Playwright : `waitForURL` expire pendant la première compilation d'une page en dev — `waitUntil: 'commit'` et délai plus long.
- Mot de passe Supabase avec caractères spéciaux (`@ # / ? %`) — ils cassent l'URL de connexion — utiliser uniquement lettres et chiffres (ou les encoder en URL).

- **Piège** : impossible d'enregistrer une clé pour `api.anthropic.com` dans l'environnement cloud (« Anthropic's own hosts are authenticated by the session itself »), et la variable `ANTHROPIC_BASE_URL` de la session sert à Claude Code lui-même — ne pas l'utiliser pour l'application. Conséquence : Claude teste l'interface avec un contenu d'exemple et une clé factice (erreur 401 → message « clé invalide »), la vraie génération se teste chez l'utilisateur.
- Piège de test : plusieurs `form [role=alert]` vides sur la page — cibler celui qui contient du texte (`.filter({ hasText: /\S/ })`).

- Piège de test : `getByLabel('Tweet 2')` attrape aussi les boutons « Monter le tweet 2 » — utiliser `getByRole('textbox', { name: 'Tweet 2', exact: true })`.

- Piège : le **premier** export prend ~30 s en `npm run dev` (compilation à la demande des bibliothèques), sans retour visuel — ajout d'un message « Préparation du téléchargement… » immédiat ; en production (`next build` + `next start`), 0,6 s.
- Script de préparation de l'environnement cloud « Threadify » : au démarrage de la session du 2026-11-08, PostgreSQL était **arrêté** (`.env` et dépendances présents) — démarrer avec `service postgresql start` si besoin.

- Piège corrigé : le menu « ⋯ » restait ouvert après « Annuler » dans une confirmation — il se referme dès qu'une action est choisie.
- Piège de test : `dialog.accept(true)` lève une erreur (`promptText` doit être une chaîne) — n'envoyer un texte qu'aux `prompt`.

- **Pièges de l'environnement cloud** : (1) le SDK Stripe (client HTTP Node par défaut) ignore `HTTPS_PROXY` → `httpClient: Stripe.createFetchHttpClient()` dans `src/lib/stripe.ts` + lancer le serveur avec `NODE_USE_ENV_PROXY=1 npm run dev` ; (2) Chromium de Playwright : `launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' } })` + `ignoreHTTPSErrors` ; (3) hôtes Stripe ajoutés à l'environnement (checkout.stripe.com, js.stripe.com, m.stripe.network, m.stripe.com, q.stripe.com, r.stripe.com, b.stripecdn.com, billing.stripe.com) ; (4) **le proxy injecte la clé secrète dans TOUTES les requêtes vers api.stripe.com, y compris celles du navigateur** (Checkout, portail) → Stripe refuse (402 sur `/v1/payment_methods`, portail blanc) : le paiement par carte et le portail se testent chez l'utilisateur ; (5) premier formulaire de clé rempli avec un mot de passe au lieu de `sk_test_…` (Stripe : « Invalid API Key ») → formulaire renvoyé, utilisateur prévenu de changer ce mot de passe s'il est réutilisé ; (6) Stripe « Adaptive Pricing » affiche le prix en USD depuis le conteneur (situé aux États-Unis) — en euros pour les clients en France.
- **Bug trouvé par l'utilisateur (2026-11-10)** : résiliation faite depuis le **portail Stripe** non affichée — le portail enregistre une **date `cancel_at`** (fin de période) et laisse `cancel_at_period_end = false` ; la page ne regardait que `cancelAtPeriodEnd`. Corrigé avec `scheduledEnd()` dans `src/lib/billing.ts` (date `cancelAt`, sinon `periodEnd` si `cancelAtPeriodEnd`), vérifié en reproduisant le cas via l'API. Tests utilisateur de l'étape 7 au 2026-11-10 : page `/admin/couts` OK (après correction de `ADMIN_EMAILS` + relance du site), paiement test OK, résiliation corrigée à revérifier chez lui.
- `/admin/couts` affichait « Page introuvable » chez l'utilisateur — `ADMIN_EMAILS` ne correspondait pas à l'e-mail du compte / site non relancé après modification du `.env` — vérifier avec `node -e "require('dotenv').config();console.log(JSON.stringify(process.env.ADMIN_EMAILS))"` puis relancer `npm run dev`.

- Better Auth « Prisma schema mismatch — Missing tables rateLimit » (page « This page couldn't load ») — `prisma migrate dev` de Prisma 7 **ne régénère plus le client** — lancer `npx prisma generate` puis relancer le serveur (chez l'utilisateur, `npm install` le fait via `postinstall`).
- `robots.txt` et `sitemap.xml` sont **statiques** (calculés au `next build`) — `BETTER_AUTH_URL` doit être la vraie adresse **au moment de la construction** sur l'hébergeur.
- Avertissement d'hydratation `caret-color: transparent` dans la console pendant les tests — ajouté par Playwright pour ses captures, pas un bug du site.
- Pièges de test : sur `/creer`, choisir un format (`text=Carrousel Instagram`) avant « Continuer » ; récupérer les liens d'e-mail dans le journal du serveur (`Objet : … Lien : …`) ; abonnement de test pour la suppression : client Stripe créé à l'inscription + `pm_card_visa` + ligne `subscription` insérée en base.

## Questions ouvertes

- Import d'article par URL (scraping) dans le MVP ou plus tard ?
- Statut juridique de l'utilisateur et TVA (franchise en base ou TVA 20 %) — impacte les prix affichés, les CGV et la page des coûts (étape 8).
