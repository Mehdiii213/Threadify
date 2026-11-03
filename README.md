# Threadify

Générateur de carrousels Instagram/LinkedIn et de threads X par IA, pour les créateurs francophones.
Écrivez une idée ou collez un article : Threadify produit un carrousel designé prêt à publier.

**Stack** : Next.js 16 · Prisma 7 + PostgreSQL · Better Auth · Tailwind CSS 4

## Lancer le projet en local

Prérequis : **Node.js 20+** et **PostgreSQL** (local, ou une base en ligne gratuite comme Neon ou Supabase).

1. Récupérer le projet :

   ```bash
   git clone https://github.com/Mehdiii213/Threadify.git
   cd Threadify
   ```

2. Créer la base de données :

   ```bash
   createdb threadify
   ```

3. Configurer l'environnement, puis renseigner `DATABASE_URL` dans `.env` :

   ```bash
   cp .env.example .env
   ```

4. Installer les dépendances (génère aussi le client Prisma) :

   ```bash
   npm install
   ```

5. Appliquer les migrations (à partir de l'étape 1) :

   ```bash
   npx prisma migrate dev
   ```

6. Lancer le serveur de développement :

   ```bash
   npm run dev
   ```

Ouvrez ensuite http://localhost:3000 : la page d'accueil doit afficher la pastille verte « Base de données : connectée ».

## Mettre à jour

```bash
git pull
npm install
npx prisma migrate dev
```

## Commandes utiles

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run lint` | Lint (ESLint) |
| `npx prisma studio` | Explorer la base de données |

Les décisions techniques et l'avancement du projet sont documentés dans [`CLAUDE.md`](./CLAUDE.md).
