# Récupérer la nouvelle version et la tester (Windows) — guide pour débutant

Ce guide explique, clic par clic, comment installer sur votre ordinateur la dernière version de Threadify (ici : **l'étape 1, les comptes utilisateurs**) et la tester.

Durée : environ 20 minutes.

---

## Avant de commencer : la « fenêtre noire », c'est quoi ?

Pendant ce guide, vous allez utiliser **l'invite de commandes** de Windows (on dit aussi « terminal » ou « cmd »). C'est une fenêtre **à fond noir avec du texte blanc/gris**, sans boutons ni menus : on y tape des instructions au clavier.

À quoi elle ressemble :

- **En haut**, une barre de titre blanche avec une petite icône noire et un texte du genre `C:\Windows\System32\cmd.exe`. Ce titre change selon ce qui tourne dedans (par exemple `npm install` ou `next-server`).
- **Dans la partie noire**, une ligne qui se termine par le signe `>` , par exemple :
  ```
  C:\Users\mehdi\Threadify-main>
  ```
  Cette ligne s'appelle **l'invite**. Elle veut dire : « je suis dans le dossier `C:\Users\mehdi\Threadify-main` et **j'attends votre commande** ». Juste après le `>`, un petit trait `_` clignote : c'est le curseur, là où va s'écrire ce que vous tapez.

Règles d'or :

1. **On tape une commande, puis on appuie sur la touche Entrée** (la grosse touche ↵ à droite du clavier). Rien ne se passe tant qu'on n'a pas appuyé sur Entrée.
2. **Une commande est terminée quand l'invite (`...Threadify-main>`) réapparaît** sur une nouvelle ligne. Tant qu'elle n'est pas revenue, on attend et on ne tape rien.
3. **Coller du texte** dans la fenêtre noire : `Ctrl + V`, ou **clic droit** dans la fenêtre.
4. ⚠️ **Piège** : si vous cliquez dans la fenêtre noire pendant qu'une commande travaille, Windows peut la mettre **en pause** : le titre de la fenêtre commence alors par le mot **« Sélection »**. Dans ce cas, appuyez sur la touche **Échap** (en haut à gauche du clavier) pour reprendre.
5. Le texte **jaune** (`warn`) est un simple avertissement. Seul le texte **rouge** avec `ERR!` ou `Error` signale un vrai problème.

---

## Étape A — Arrêter l'ancienne version du site

Si le site tourne encore depuis la dernière fois, il y a une fenêtre noire ouverte dont le titre est `next-server (v16.4.5)` ou `npm run dev` (regardez dans la barre des tâches, en bas de l'écran). Si vous l'avez déjà fermée ou si vous avez redémarré l'ordinateur, passez directement à l'étape B.

1. Cliquez **une fois** dans cette fenêtre noire pour la sélectionner.
2. Appuyez sur **Ctrl + C** (maintenez la touche `Ctrl`, appuyez sur `C`, relâchez).
3. La fenêtre affiche la question :
   ```
   Terminer le programme de commandes (O/N) ?
   ```
4. Tapez la lettre **O** puis **Entrée**.
5. L'invite `C:\Users\mehdi\OneDrive\Bureau\Threadify-main>` réapparaît : le site est arrêté.
6. Fermez cette fenêtre avec la **croix X** en haut à droite.

---

## Étape B — Télécharger la nouvelle version

1. Ouvrez votre navigateur et allez sur **https://github.com/Mehdiii213/Threadify**.
2. Vous voyez une page avec une liste de dossiers et de fichiers (`docs`, `prisma`, `src`, `CLAUDE.md`, `README.md`…). Au-dessus de cette liste, à droite, il y a un **bouton vert « <> Code »**. Cliquez dessus.
3. Un petit menu s'ouvre. Tout en bas, cliquez sur **« Download ZIP »**.
4. Le fichier **`Threadify-main.zip`** se télécharge dans votre dossier **Téléchargements**.

---

## Étape C — Décompresser au bon endroit (en dehors de OneDrive)

La dernière fois, le dossier était dans OneDrive, ce qui a rendu l'installation très lente (9 minutes). Cette fois, on le met directement dans votre dossier personnel `C:\Users\mehdi`.

1. Ouvrez l'**Explorateur de fichiers** : l'icône en forme de **dossier jaune** dans la barre des tâches (ou appuyez sur les touches **Windows + E**).
2. Dans la colonne de gauche, cliquez sur **Téléchargements**.
3. Trouvez **`Threadify-main.zip`** (icône de dossier avec une fermeture éclair). Faites un **clic droit** dessus, puis **« Extraire tout… »**.
4. Une fenêtre s'ouvre : « Extraire des dossiers compressés (zippés) ». Elle contient un champ « Les fichiers seront extraits dans ce dossier ». Cliquez sur le bouton **« Parcourir… »** à côté.
5. Dans la fenêtre qui s'ouvre, à gauche, cliquez sur **« Ce PC »**, puis double-cliquez sur **« Disque local (C:) »**, puis sur **« Utilisateurs »**, puis cliquez **une fois** sur **« mehdi »**. Cliquez sur **« Sélectionner un dossier »**.
6. Le champ affiche maintenant `C:\Users\mehdi`. Cliquez sur **« Extraire »**.
7. Une fenêtre s'ouvre sur le résultat. Double-cliquez sur **`Threadify-main`** si besoin, jusqu'à voir les fichiers `package.json`, `README.md`, `CLAUDE.md` et les dossiers `docs`, `prisma`, `public`, `src`.

> Si un message dit qu'un dossier `Threadify-main` existe déjà à cet endroit, choisissez **« Remplacer les fichiers dans la destination »**.

Vous êtes maintenant **dans le nouveau dossier** : `C:\Users\mehdi\Threadify-main`. Laissez cette fenêtre de l'Explorateur ouverte.

---

## Étape D — Ouvrir la fenêtre noire dans le nouveau dossier

1. Dans la fenêtre de l'Explorateur (celle du nouveau dossier), regardez **tout en haut** : il y a une **barre d'adresse** qui affiche `Ce PC > Disque local (C:) > Utilisateurs > mehdi > Threadify-main`.
2. Cliquez **une fois** dans un espace vide de cette barre : le texte devient `C:\Users\mehdi\Threadify-main` et il est surligné en bleu.
3. Tapez **`cmd`** (le texte bleu est remplacé) puis **Entrée**.
4. La fenêtre noire s'ouvre et affiche :
   ```
   Microsoft Windows [version 10.0.19045.6466]
   (c) Microsoft Corporation. Tous droits réservés.

   C:\Users\mehdi\Threadify-main>
   ```
   ✅ La dernière ligne doit bien se terminer par **`Threadify-main>`** (et ne plus contenir `OneDrive`).

Gardez cette fenêtre ouverte pour toutes les étapes suivantes.

---

## Étape E — Récupérer votre ancien fichier `.env`

Le fichier `.env` contient l'adresse de votre base Supabase. Il n'est pas sur GitHub (c'est voulu : il contient des secrets), donc on le copie depuis l'ancien dossier.

1. Dans la fenêtre noire, tapez exactement (vous pouvez copier la ligne ci-dessous et la coller avec un clic droit) :
   ```bash
   copy "C:\Users\mehdi\OneDrive\Bureau\Threadify-main\.env" .env
   ```
2. Appuyez sur **Entrée**. La fenêtre affiche :
   ```
           1 fichier(s) copié(s).
   ```
   ✅ C'est bon.

> Si la fenêtre affiche `Le fichier spécifié est introuvable.` : l'ancien dossier n'est pas à cet endroit. Dites-le-moi avec une capture.

---

## Étape F — Ajouter la clé secrète des comptes dans `.env`

Les comptes utilisateurs ont besoin d'une **clé secrète** : une longue suite de caractères aléatoires qui sert à protéger les connexions. On la fabrique, puis on la colle dans `.env`.

### F.1 Fabriquer la clé

1. Dans la fenêtre noire, tapez (ou collez) :
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
2. Appuyez sur **Entrée**. Une ligne de caractères bizarres apparaît, par exemple :
   ```
   q8Zt3vH0yK9m+Lw2Rb7NcX1uJ5sE4pDfGaQ6iT0oVhM=
   ```
   (la vôtre sera différente, c'est normal), puis l'invite `C:\Users\mehdi\Threadify-main>` revient.

### F.2 Copier la clé

1. Avec la souris, **cliquez juste avant le premier caractère** de la clé, **maintenez le bouton** et **glissez jusqu'au dernier caractère** (souvent un `=`). La clé apparaît sur fond blanc (surlignée). Le titre de la fenêtre commence par « Sélection ».
2. Appuyez sur **Entrée** : la clé est copiée (comme un Ctrl + C) et le surlignage disparaît.

### F.3 Coller la clé dans `.env`

1. Dans la fenêtre noire, tapez :
   ```bash
   notepad .env
   ```
   puis **Entrée**.
2. Le **Bloc-notes** s'ouvre (fenêtre blanche avec un menu « Fichier, Edition, Format… »). Il contient :
   ```
   # Base PostgreSQL locale de développement
   DATABASE_URL="postgresql://postgres.xxxx:VotreMotDePasse@aws-0-....pooler.supabase.com:5432/postgres"
   ```
   (c'est votre adresse Supabase de la dernière fois — **ne la modifiez pas**).
3. Cliquez **à la toute fin du texte**, puis appuyez sur **Entrée** deux fois pour descendre de deux lignes.
4. Tapez la ligne suivante **jusqu'au premier guillemet inclus** :
   ```
   BETTER_AUTH_SECRET="
   ```
5. Appuyez sur **Ctrl + V** : votre clé se colle. Puis tapez le **guillemet fermant** `"`.
6. Appuyez sur **Entrée** et tapez la dernière ligne :
   ```
   BETTER_AUTH_URL="http://localhost:3000"
   ```
7. Le fichier doit ressembler à ceci (avec vos propres valeurs) :
   ```
   # Base PostgreSQL locale de développement
   DATABASE_URL="postgresql://postgres.xxxx:VotreMotDePasse@aws-0-....pooler.supabase.com:5432/postgres"

   BETTER_AUTH_SECRET="q8Zt3vH0yK9m+Lw2Rb7NcX1uJ5sE4pDfGaQ6iT0oVhM="
   BETTER_AUTH_URL="http://localhost:3000"
   ```
   Vérifiez : **chaque valeur est entre guillemets**, il n'y a **pas d'espace** autour du `=`.
8. Enregistrez avec **Ctrl + S**, puis fermez le Bloc-notes avec la **croix X**.

> Ne partagez jamais ce fichier ni sa clé : si vous m'envoyez une capture qui le montre, cachez le mot de passe et la clé.

---

## Étape G — Installer les composants du site

1. Dans la fenêtre noire, tapez :
   ```bash
   npm install
   ```
   puis **Entrée**.
2. Ce que vous allez voir :
   - le titre de la fenêtre devient `npm install` ;
   - pendant un moment, **rien ne semble se passer** (juste le curseur, ou une petite barre qui tourne) : c'est normal, il télécharge ;
   - puis du texte apparaît, avec des lignes **jaunes** `npm warn …` : c'est normal ;
   - à la fin, une ligne du genre :
     ```
     added 517 packages, and audited 524 packages in 2m
     ```
     puis d'autres messages (`vulnerabilities`, `New major version of npm`…) à **ignorer**.
3. ✅ C'est terminé quand l'invite `C:\Users\mehdi\Threadify-main>` revient tout en bas.

Durée : 1 à 3 minutes (beaucoup moins que la dernière fois grâce au dossier hors OneDrive).

> ⚠️ Ne tapez **jamais** `npm audit fix --force` même si la fenêtre le propose : ça casserait le projet.

---

## Étape H — Créer les tables des comptes dans Supabase

Cette commande ajoute dans votre base Supabase les « tables » (des sortes de tableaux Excel) qui vont stocker les comptes : `user` (les utilisateurs), `session` (qui est connecté), `account` (les mots de passe chiffrés) et `verification`.

1. Tapez :
   ```bash
   npx prisma migrate deploy
   ```
   puis **Entrée**.
2. Après quelques secondes, vous devez voir à peu près :
   ```
   Loaded Prisma config from prisma.config.ts.
   Prisma schema loaded from prisma\schema.prisma
   Datasource "db": PostgreSQL database "postgres", schema "public" at "aws-0-....pooler.supabase.com:5432"

   1 migration found in prisma/migrations

   Applying migration `20261105192537_init_auth`

   The following migration(s) have been applied:

   migrations/
     └─ 20261105192537_init_auth/
       └─ migration.sql

   All migrations have been successfully applied.
   ```
3. ✅ La phrase importante est **`All migrations have been successfully applied.`**, suivie de l'invite.

Si vous voyez autre chose :

| Ce que vous voyez | Que faire |
|---|---|
| `No pending migrations to apply.` | ✅ Les tables existent déjà. Tout va bien. |
| Un message en rouge qui parle de **« engine »** | Tapez `npm install-scripts approve prisma @prisma/engines`, Entrée, puis `npm install`, Entrée, puis recommencez `npx prisma migrate deploy`. |
| `P1001: Can't reach database server` | Votre projet Supabase est peut-être **en pause** : allez sur supabase.com, ouvrez le projet et cliquez sur **« Restore project »**, attendez 2 minutes et recommencez. |
| `P1000: Authentication failed` | Le mot de passe dans `.env` est incorrect (voir guide `docs/lancer-en-local.md`, étape 3.2). |
| Autre chose en rouge | Envoyez-moi une capture. |

---

## Étape I — Lancer le site

1. Tapez :
   ```bash
   npm run dev
   ```
   puis **Entrée**.
2. Le titre de la fenêtre devient `next-server (v16.4.5)` et vous voyez :
   ```
   ▲ Next.js 16.4.5 (Turbopack)
   - Local:         http://localhost:3000
   - Network:       http://192.168.1.34:3000
   - Environments: .env
   ✓ Ready in 3.0s
   ```
3. ✅ Le site est lancé. **Cette fois, l'invite ne revient pas** : c'est normal, la fenêtre est occupée à faire tourner le site. **Ne la fermez pas** (vous pouvez la réduire avec le tiret `—` en haut à droite).

> Si Windows affiche une fenêtre « Pare-feu Windows Defender » demandant l'accès pour Node.js, cliquez sur **« Autoriser l'accès »**.

---

## Étape J — Tester les comptes dans le navigateur

1. Ouvrez votre navigateur, tapez **`localhost:3000`** dans la barre d'adresse, puis Entrée.
   - La première ouverture peut prendre 10 à 30 secondes (la fenêtre noire affiche `Compiling / ...`).
   - ✅ Vous voyez la page d'accueil Threadify. **Nouveautés** : en haut à droite, à côté de la pastille verte, un bouton **« Connexion »** ; au centre, le bouton violet s'appelle maintenant **« Commencer gratuitement »**.

2. **Créer un compte** : cliquez sur **« Commencer gratuitement »**.
   - ✅ Une page « **Créer un compte** » s'affiche, avec trois cases : « Prénom ou nom », « Adresse e-mail », « Mot de passe ».
   - Remplissez-les (mot de passe de **8 caractères minimum**), puis cliquez sur **« Créer mon compte »**.
   - Le bouton affiche « Un instant… » pendant une seconde.

3. ✅ Vous arrivez sur **« Mon espace »** : un grand « **Bonjour {votre prénom} 👋** », votre e-mail en dessous, un bouton **« Se déconnecter »** à droite et un cadre en pointillés « Vos carrousels et threads apparaîtront ici ».

4. **Se déconnecter** : cliquez sur **« Se déconnecter »**.
   - ✅ Vous arrivez sur la page « **Bon retour !** » (la page de connexion).

5. **Vérifier que l'espace est protégé** : dans la barre d'adresse, tapez `localhost:3000/espace` puis Entrée.
   - ✅ Vous êtes **renvoyé automatiquement** sur la page de connexion : impossible de voir l'espace sans être connecté.

6. **Tester une erreur** : entrez votre e-mail avec un **mauvais** mot de passe, cliquez sur **« Se connecter »**.
   - ✅ Un cadre rouge affiche « **E-mail ou mot de passe incorrect.** »

7. **Se reconnecter** : entrez le **bon** mot de passe, cliquez sur **« Se connecter »**.
   - ✅ Retour sur « Bonjour {votre prénom} 👋 ».

---

## Étape K (bonus) — Voir votre compte dans Supabase

1. Allez sur **https://supabase.com/dashboard** et ouvrez votre projet `threadify`.
2. Dans la colonne de gauche, cliquez sur l'icône en forme de **tableau** : **« Table Editor »**.
3. ✅ Vous voyez les nouvelles tables `user`, `session`, `account`, `verification`. Cliquez sur **`user`** : une ligne avec votre nom et votre e-mail apparaît.
4. Dans la table **`account`**, la colonne `password` contient une longue suite de caractères illisibles : c'est votre mot de passe **chiffré** (personne, même pas vous, ne peut le relire). C'est normal et c'est voulu.

---

## Étape L — Ranger

Quand tout fonctionne, l'ancien dossier `C:\Users\mehdi\OneDrive\Bureau\Threadify-main` ne sert plus. Vous pourrez le supprimer (clic droit → Supprimer). À partir de maintenant, le projet vit dans **`C:\Users\mehdi\Threadify-main`**.

Pour relancer le site un autre jour : étape D (ouvrir la fenêtre noire dans `C:\Users\mehdi\Threadify-main`), puis étape I (`npm run dev`), puis `localhost:3000`.

---

## Aide-mémoire

| Je veux… | Je fais… |
|---|---|
| Ouvrir la fenêtre noire dans le projet | Explorateur → dossier `C:\Users\mehdi\Threadify-main` → barre d'adresse → `cmd` → Entrée |
| Lancer le site | `npm run dev` |
| Arrêter le site | Ctrl + C, puis `O`, Entrée |
| Voir le site | `localhost:3000` dans le navigateur |
| Débloquer une fenêtre « Sélection » | Touche Échap |
| Coller dans la fenêtre noire | Clic droit ou Ctrl + V |
| Copier depuis la fenêtre noire | Surligner à la souris, puis Entrée |
