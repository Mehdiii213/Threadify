# Tester l'étape 2 (écrire son idée et choisir le format) — guide pour débutant, Windows

Durée : environ 15 minutes. Bonne nouvelle : c'est **plus simple** que la dernière fois. Votre fichier `.env` est déjà en place et il n'y a **rien à y ajouter**.

> Rappel sur la **fenêtre noire** (invite de commandes) : voir le début de `docs/mettre-a-jour.md`. En bref : on tape une commande, on appuie sur **Entrée**, et la commande est terminée quand la ligne `C:\Users\mehdi\Threadify-main>` réapparaît en bas. Si le titre de la fenêtre commence par « Sélection », appuyez sur **Échap**.

---

## Étape A — Arrêter le site s'il tourne encore

Cherchez dans la barre des tâches (en bas de l'écran) une fenêtre noire intitulée **`next-server (v16.4.5)`**. Si elle n'existe pas, passez à l'étape B.

1. Cliquez **une fois** dedans.
2. Appuyez sur **Ctrl + C**.
3. La question `Terminer le programme de commandes (O/N) ?` apparaît : tapez **O** puis **Entrée**.
4. Fermez la fenêtre avec la **croix X** en haut à droite.

> Important : le site doit être arrêté **avant** l'étape C, sinon Windows refusera de remplacer certains fichiers (« fichier utilisé par un autre programme »).

---

## Étape B — Télécharger la nouvelle version

1. Dans votre navigateur, allez sur **https://github.com/Mehdiii213/Threadify**.
2. Cliquez sur le **bouton vert « <> Code »**, puis tout en bas sur **« Download ZIP »**.
3. Le fichier `Threadify-main.zip` arrive dans **Téléchargements**.

> Si Windows nomme le fichier `Threadify-main (1).zip` (car l'ancien est encore là), ce n'est pas grave : utilisez ce nouveau fichier à l'étape C. Vous pouvez supprimer les anciens ZIP.

---

## Étape C — Décompresser **par-dessus** l'ancienne version

Cette fois, on décompresse **au même endroit** que la dernière fois (`C:\Users\mehdi`). Les fichiers du site seront remplacés par les nouveaux, mais **votre fichier `.env` sera conservé** (il n'est pas dans le ZIP).

1. Ouvrez l'**Explorateur de fichiers** (icône **dossier jaune**, ou **Windows + E**), puis **Téléchargements** dans la colonne de gauche.
2. **Clic droit** sur le ZIP le plus récent → **« Extraire tout… »**.
3. Cliquez sur **« Parcourir… »** → **Ce PC** → double-clic **Disque local (C:)** → double-clic **Utilisateurs** → **un** clic sur **mehdi** → **« Sélectionner un dossier »**.
4. Le champ affiche `C:\Users\mehdi`. Cliquez sur **« Extraire »**.
5. Windows affiche une fenêtre **« Remplacer ou ignorer les fichiers »** (car le dossier existe déjà). Cliquez sur **« Remplacer les fichiers dans la destination »** (la ligne avec une coche ✔).
6. Une barre de progression défile quelques secondes, puis une fenêtre s'ouvre.

✅ Vérification : ouvrez `C:\Users\mehdi\Threadify-main`. Vous devez y voir, entre autres, le dossier **`docs`** contenant un fichier **`tester-etape-2.md`** (ce guide), et toujours votre fichier **`.env`**.

---

## Étape D — Ouvrir la fenêtre noire dans le dossier

1. Dans l'Explorateur, ouvrez le dossier **`C:\Users\mehdi\Threadify-main`**.
2. Cliquez dans la **barre d'adresse** en haut (le texte devient bleu), tapez **`cmd`**, puis **Entrée**.
3. La fenêtre noire s'ouvre et se termine par :
   ```
   C:\Users\mehdi\Threadify-main>
   ```

---

## Étape E — Installer les composants

1. Tapez :
   ```bash
   npm install
   ```
   puis **Entrée**.
2. Comme la dernière fois : un moment sans rien, puis des lignes jaunes `npm warn` (normales), et à la fin une ligne du type `up to date, audited 524 packages in 30s` ou `added 3 packages…`.
3. ✅ Terminé quand l'invite `C:\Users\mehdi\Threadify-main>` revient. C'est plus rapide que la première fois (tout est déjà presque installé).

---

## Étape F — Créer la nouvelle table dans Supabase

Cette version ajoute une table **`creation`** : c'est là que seront rangées vos idées et articles avec le format choisi.

1. Tapez :
   ```bash
   npx prisma migrate deploy
   ```
   puis **Entrée**.
2. Vous devez voir à peu près :
   ```
   2 migrations found in prisma/migrations

   Applying migration `20261105201520_creations`

   The following migration(s) have been applied:

   migrations/
     └─ 20261105201520_creations/
       └─ migration.sql

   All migrations have been successfully applied.
   ```
3. ✅ La phrase à repérer : **`All migrations have been successfully applied.`** (seule la **nouvelle** migration est appliquée : celle de l'étape 1 l'a déjà été).

En cas de souci : `P1001` → projet Supabase en pause (bouton **Restore project** sur supabase.com) ; autre texte rouge → envoyez-moi une capture.

---

## Étape G — Lancer le site

1. Tapez :
   ```bash
   npm run dev
   ```
   puis **Entrée**.
2. ✅ Le titre devient `next-server (v16.4.5)`, et vous voyez `Local: http://localhost:3000` puis `✓ Ready`. L'invite ne revient pas : c'est normal. **Ne fermez pas la fenêtre** (réduisez-la avec le **—**).

---

## Étape H — Tester dans le navigateur

Ouvrez **`localhost:3000`** dans votre navigateur (la première ouverture peut prendre jusqu'à 30 secondes).

### 1. Aller sur l'écran de création
- Cliquez sur le bouton violet **« Commencer gratuitement »**.
- Si vous êtes connecté : ✅ vous arrivez directement sur **« Nouvelle création »**.
- Si vous n'êtes pas connecté : vous arrivez sur « Créer un compte ». Utilisez plutôt **« Se connecter »** (en bas) avec votre compte de l'étape 1, puis cliquez sur **« + Nouvelle création »** dans votre espace.

### 2. Découvrir l'écran
✅ Vous voyez :
- en haut, **« 1. Votre point de départ »** avec deux onglets : **💡 Une idée** (sélectionné, en violet) et **📄 Un article** ;
- une zone de texte avec un exemple en gris, et en dessous à droite un compteur **« 0 / 500 caractères »** ;
- **« 2. Le format »** avec trois cartes : **Carrousel Instagram**, **Carrousel LinkedIn**, **Thread X** ;
- un bouton violet **« Continuer → »**.

### 3. Tester les messages d'erreur
- Tapez juste **`Test`** dans la zone de texte, **ne choisissez pas de format**, cliquez sur **« Continuer → »**.
- ✅ Deux messages rouges apparaissent : « **Votre idée doit faire au moins 10 caractères (actuellement 4).** » et « **Choisissez un format.** ». Votre texte est toujours là.

### 4. Créer une idée
- Remplacez le texte par une vraie idée, par exemple : **`5 erreurs à éviter quand on lance son entreprise`**.
- Cliquez sur la carte **Carrousel Instagram** : ✅ elle devient **bordée de violet** avec un fond violet clair.
- Cliquez sur **« Continuer → »** (le bouton affiche « Enregistrement… » un instant).
- ✅ Vous arrivez sur une page récapitulative : « **✓ Création enregistrée** », le titre **Carrousel Instagram**, « Une idée · » suivi de la date et l'heure, votre texte dans un encadré, et un bouton **« ✨ Générer »** grisé avec « Disponible à l'étape suivante. »

### 5. Créer à partir d'un article
- Cliquez sur **« Mon espace »** (en haut à droite), puis **« + Nouvelle création »**.
- Cliquez sur l'onglet **📄 Un article** : ✅ la zone de texte devient beaucoup plus grande et le compteur indique **« / 20 000 caractères »**.
- Copiez-collez un article trouvé sur Internet (au moins **200 caractères**, soit environ 3 à 4 lignes), choisissez **Thread X**, puis **« Continuer → »**.
- ✅ Récapitulatif avec le titre **Thread X** et « Un article ».

### 6. Voir la liste dans votre espace
- Cliquez sur **« Mon espace »**.
- ✅ Sous « **Mes créations** », vos deux créations apparaissent, la plus récente en haut : le format en violet, le début du texte, « Une idée » ou « Un article » et la date. Cliquez sur une ligne : vous revenez sur son récapitulatif.

### 7. (Facultatif) Vérifier la page « introuvable »
- Tapez **`localhost:3000/creations/nimporte-quoi`** dans la barre d'adresse.
- ✅ Une page « **Erreur 404 — Page introuvable** » en français, avec les boutons « Mon espace » et « Accueil ».

---

## Étape I (bonus) — Voir vos créations dans Supabase

Sur **supabase.com** → votre projet → **Table Editor** (icône tableau à gauche) → table **`creation`** : ✅ une ligne par création, avec le texte (`sourceText`), le type (`IDEE` ou `ARTICLE`), le format (`CARROUSEL_INSTAGRAM`, `THREAD_X`…) et le statut `BROUILLON` (« pas encore généré par l'IA »).

---

## Pour arrêter le site

Dans la fenêtre noire : **Ctrl + C**, puis **O**, puis **Entrée**.
