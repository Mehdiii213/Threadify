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

## Commandes utiles

> À compléter une fois le projet initialisé.

```bash
npm run dev            # serveur de dev sur http://localhost:3000
npx prisma migrate dev # appliquer / créer une migration
npx prisma studio      # explorer la base
```

## État d'avancement

- [ ] Étape 0 — Initialisation du projet (Next.js + Tailwind + Prisma + PostgreSQL)
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

## Pièges rencontrés

> Format : `Problème — Cause — Solution`

_Aucun pour l'instant._

## Questions ouvertes

- Fournisseur d'IA pour la génération (à décider à l'étape 3).
- Méthode d'export des carrousels (rendu côté serveur ou côté client).
- Import d'article par URL (scraping) dans le MVP ou plus tard ?
- Modèle de monétisation (freemium, quotas de générations).
