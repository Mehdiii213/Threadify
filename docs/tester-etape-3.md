# Tester l'étape 3 (génération par l'IA) — guide pour débutant, Windows

Durée : environ 15 minutes. C'est **vous** qui ferez la toute première vraie génération avec Claude, sur votre ordinateur et avec votre clé.

> Rappel sur la **fenêtre noire** (invite de commandes) : on tape une commande, on appuie sur **Entrée**, et la commande est terminée quand la ligne `C:\2222\Threadify-main>` réapparaît en bas. Si le titre de la fenêtre commence par « Sélection », appuyez sur **Échap**.

Avant de commencer, gardez sous la main votre **clé Claude** (elle commence par `sk-ant-`, vous l'avez copiée dans un Bloc-notes en la créant sur platform.claude.com).

> Clé perdue ? Pas grave : sur **platform.claude.com** → **Settings** → **API keys** → **Create Key**, puis copiez la nouvelle clé (elle ne s'affiche qu'une fois). Vous pouvez supprimer l'ancienne.

---

## Étape A — Arrêter le site s'il tourne

Si une fenêtre noire intitulée **`next-server (v16.4.5)`** est ouverte : cliquez dedans, **Ctrl + C**, tapez **O**, **Entrée**, puis fermez-la (croix **X**). Sinon, passez à l'étape B.

---

## Étape B — Télécharger la nouvelle version

1. Allez sur **https://github.com/Mehdiii213/Threadify**.
2. Bouton vert **« <> Code »** → **« Download ZIP »**.

---

## Étape C — Décompresser **par-dessus** votre dossier actuel

1. Explorateur (**Windows + E**) → **Téléchargements**.
2. **Clic droit** sur le ZIP le plus récent → **« Extraire tout… »**.
3. **« Parcourir… »** → **Ce PC** → double-clic **Disque local (C:)** → **un** clic sur **2222** → **« Sélectionner un dossier »**.
4. Le champ affiche `C:\2222`. Cliquez sur **« Extraire »**.
5. Fenêtre **« Remplacer ou ignorer les fichiers »** → **« Remplacer les fichiers dans la destination »**.

✅ Votre fichier `.env` est conservé (il n'est pas dans le ZIP). Vérification : le dossier `C:\2222\Threadify-main\docs` contient maintenant **`tester-etape-3.md`**.

---

## Étape D — Ouvrir la fenêtre noire

Explorateur → dossier **`C:\2222\Threadify-main`** → clic dans la **barre d'adresse** → tapez **`cmd`** → **Entrée**.

✅ La fenêtre noire se termine par `C:\2222\Threadify-main>`.

---

## Étape E — Ajouter votre clé Claude dans `.env`

1. Tapez :
   ```bash
   notepad .env
   ```
   puis **Entrée**. Le Bloc-notes s'ouvre avec vos lignes `DATABASE_URL`, `BETTER_AUTH_SECRET` et `BETTER_AUTH_URL` — **ne les modifiez pas**.
2. Cliquez **tout à la fin du texte**, appuyez **deux fois sur Entrée**.
3. Tapez au clavier :
   ```
   ANTHROPIC_API_KEY="
   ```
   puis collez votre clé avec **Ctrl + V**, puis tapez le guillemet fermant **`"`**.
4. La nouvelle ligne doit ressembler à :
   ```
   ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```
   ✅ Elle commence par `ANTHROPIC_API_KEY="sk-ant-`, finit par `"`, sans espace autour du `=`.
5. **Ctrl + S** pour enregistrer, puis fermez le Bloc-notes (croix **X**).

> ⚠️ Cette clé donne accès à votre crédit Anthropic : ne la montrez jamais (cachez-la sur vos captures) et ne la collez jamais dans une conversation.

---

## Étape F — Installer les nouveaux composants

```bash
npm install
```
✅ Des lignes jaunes `npm warn` (normales), puis `added … packages` ; terminé quand l'invite revient. Ne tapez **pas** `npm audit fix --force`.

---

## Étape G — Mettre à jour la base Supabase

Cette version ajoute de quoi **enregistrer le texte généré** avec chaque création.

```bash
npx prisma migrate deploy
```
✅ Vous devez voir `Applying migration `20261106183627_generation`` puis **`All migrations have been successfully applied.`**

---

## Étape H — Lancer le site

```bash
npm run dev
```
✅ Le titre devient `next-server (v16.4.5)`, puis `✓ Ready`. **Ne fermez pas la fenêtre.**

---

## Étape I — Votre première génération 🎉

Ouvrez **`localhost:3000`** et connectez-vous si besoin (**« Connexion »**).

### 1. Générer un carrousel
1. Cliquez sur **« Mon espace »** : vos créations de l'étape 2 sont là, avec une étiquette grise **« Brouillon »**.
2. Cliquez sur votre création **Carrousel Instagram** (« 5 erreurs à éviter… »).
3. ✅ Le bouton violet **« ✨ Générer »** est maintenant cliquable. Cliquez dessus.
4. ✅ Le bouton affiche **« Génération en cours… »** avec une petite roue qui tourne et le message « L'IA écrit votre contenu, cela prend généralement 10 à 60 secondes… ». **Patientez sans recharger la page.**
5. ✅ La page se met à jour :
   - en haut, **« ✨ Contenu généré »** ;
   - le bouton devient **« ↻ Régénérer »** ;
   - en dessous, une section **« Résultat »** avec **6 à 10 slides** affichées en cartes : la slide 1 est une **accroche**, la dernière un **appel à l'action** (« Enregistrez ce post… », « Abonnez-vous… »).

Le design est volontairement simple : les vrais modèles (couleurs, polices) arrivent à l'étape 4.

### 2. Générer un thread X
1. Retournez dans **« Mon espace »** et ouvrez votre création **Thread X**.
2. Cliquez sur **« ✨ Générer »** et patientez.
3. ✅ **5 à 12 tweets** numérotés, chacun avec un compteur **« … / 280 »** (toujours sous 280) et un bouton **« Copier »**. En haut à droite : **« Copier tout le thread »**.
4. Cliquez sur **« Copier »** à côté d'un tweet : ✅ le bouton affiche **« ✓ Copié »**. Collez (Ctrl + V) dans un Bloc-notes pour vérifier.

### 3. Essayer « Régénérer »
Cliquez sur **« ↻ Régénérer »** : ✅ après quelques secondes, une **nouvelle version** remplace l'ancienne.

### 4. Vérifier l'espace
Dans **« Mon espace »** : ✅ les créations générées portent une étiquette violette **« Générée »**.

---

## En cas de message rouge sous le bouton

| Message | Que faire |
|---|---|
| « La clé de l'IA est absente… » | La ligne `ANTHROPIC_API_KEY` manque dans `.env` (étape E). Après l'avoir ajoutée : **Ctrl + C**, **O**, puis `npm run dev` à nouveau. |
| « La clé de l'IA est invalide… » | La clé est mal copiée (espace, guillemet manquant, clé supprimée). Recréez-en une et remplacez-la (étape E), puis relancez le site. |
| « Le service d'IA a refusé la demande… crédit… » | Vérifiez votre crédit sur **platform.claude.com** → **Settings** → **Billing**. |
| « Trop de demandes… » / « surchargé » | Patientez une minute et réessayez. |
| Autre message | Envoyez-moi une capture de la page **et** de la fenêtre noire (le détail technique y apparaît, sur une ligne qui commence par `[generation]`). |

> 💡 Si vous modifiez le fichier `.env` pendant que le site tourne, il faut **relancer** le site (Ctrl + C, O, puis `npm run dev`) pour que le changement soit pris en compte.

---

## Combien ça coûte ?

Chaque génération coûte **quelques centimes** sur votre crédit Anthropic (modèle Claude Opus 5.5). Vous pouvez suivre votre consommation sur **platform.claude.com** → **Usage**.
