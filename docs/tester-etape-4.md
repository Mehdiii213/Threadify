# Tester l'étape 4 (design des carrousels) — guide pour débutant, Windows

Durée : environ 15 minutes. Votre `.env` (Supabase + clé Claude) ne change pas.

> Rappel sur la **fenêtre noire** : on tape une commande, on appuie sur **Entrée**, et c'est terminé quand la ligne `C:\2222\Threadify-main>` réapparaît. Si le titre de la fenêtre commence par « Sélection », appuyez sur **Échap**.

---

## Étape A — Arrêter le site s'il tourne

Fenêtre noire intitulée **`next-server (v16.4.5)`** : cliquez dedans, **Ctrl + C**, tapez **O**, **Entrée**. Gardez la fenêtre ouverte (l'invite `C:\2222\Threadify-main>` est revenue).

## Étape B — Télécharger la nouvelle version

**https://github.com/Mehdiii213/Threadify** → bouton vert **« <> Code »** → **« Download ZIP »**.

## Étape C — Décompresser par-dessus

1. Explorateur (**Windows + E**) → **Téléchargements**.
2. **Clic droit** sur le ZIP le plus récent → **« Extraire tout… »** → **« Parcourir… »** → **Ce PC** → double-clic **Disque local (C:)** → **un** clic sur **2222** → **« Sélectionner un dossier »** → **« Extraire »**.
3. **« Remplacer les fichiers dans la destination »**.

✅ Le dossier `C:\2222\Threadify-main\docs` contient **`tester-etape-4.md`**.

## Étape D — Installer et mettre à jour la base

Dans la fenêtre noire (`C:\2222\Threadify-main>`), une commande à la fois, en attendant que l'invite revienne :

```bash
npm install
```
✅ Lignes jaunes `npm warn` (normales), puis l'invite revient.

```bash
npx prisma migrate deploy
```
✅ `Applying migration `20261106195716_design`` puis **`All migrations have been successfully applied.`** (cette mise à jour ajoute de quoi enregistrer le design de chaque carrousel).

## Étape E — Lancer le site

```bash
npm run dev
```
✅ `✓ Ready`. Ne fermez pas la fenêtre.

---

## Étape F — Tester l'éditeur

Ouvrez **`localhost:3000`** → **« Mon espace »** → votre **Carrousel Instagram** déjà généré (étiquette violette « Générée »).

### 1. Découvrir l'éditeur
Sous le bouton « ↻ Régénérer », une section **« Design et textes »** :
- ✅ **à gauche**, un panneau de réglages : **Modèle**, **Palette**, **Police**, **Signature**, et un bouton **« Enregistrer »** (grisé tant que rien n'a changé) avec le message « Tout est enregistré » ;
- ✅ **à droite**, vos slides **en vrai visuel** (format vertical Instagram), chacune avec ses cases **Titre** et **Texte** et les boutons **↑**, **↓**, **Supprimer**.
- ✅ La slide 1 est la **couverture** (grand titre, « Glisse → » en bas à droite) ; les suivantes sont numérotées **01, 02…** ; la dernière met le texte en valeur avec un trait de couleur.

### 2. Changer le modèle
Cliquez sur **Minimal**, puis **Audacieux**, puis **Dégradé** : ✅ toutes les slides changent instantanément. Sous le bouton Enregistrer : « Modifications non enregistrées ».

### 3. Changer les couleurs
- Cliquez sur une **palette** (Violet, Nuit, Corail, Sapin, Soleil, Noir & blanc) : ✅ les couleurs changent.
- Ou cliquez sur un des trois rectangles **Fond**, **Texte**, **Accent** : une fenêtre de choix de couleur s'ouvre ; choisissez votre couleur (par exemple celle de votre marque).

### 4. Changer la police
Cliquez sur **Inter**, **Montserrat**, **Poppins** ou **Playfair Display** (chaque bouton est écrit dans sa police) : ✅ les slides changent.

### 5. Votre signature
- ✅ La case « Afficher ma signature sur les slides » est cochée, votre nom est pré-rempli.
- Tapez votre **pseudo** Instagram dans la deuxième case (sans le @) : ✅ il apparaît en bas de chaque slide, sous votre nom, à côté d'une pastille avec vos initiales.
- Décochez la case pour retirer la signature.

### 6. Modifier les textes
- Changez le **titre** d'une slide : ✅ l'aperçu se met à jour pendant que vous tapez.
- Cliquez sur **↓** à côté d'une slide : ✅ elle descend d'un cran.
- **« + Ajouter une slide »** (tout en bas) ajoute une slide avant la dernière ; **« Supprimer »** en retire une.

### 7. Enregistrer
1. Cliquez sur **« Enregistrer »** : ✅ « ✓ Modifications enregistrées ».
2. Rechargez la page (touche **F5**) : ✅ votre modèle, vos couleurs, votre police, votre signature et vos textes sont toujours là.

> Si vous essayez de quitter la page sans enregistrer, le navigateur vous demande de confirmer.

### 8. « Régénérer » demande confirmation
Cliquez sur **« ↻ Régénérer »** : ✅ une fenêtre demande « Régénérer remplace les textes actuels, y compris vos modifications. Le design est conservé. Continuer ? ». Cliquez sur **Annuler** pour garder vos textes.

### 9. Le thread X
Ouvrez votre **Thread X** : ✅ chaque tweet est maintenant **modifiable**, avec son compteur. Si un tweet dépasse 280 caractères, le compteur passe en rouge et « Enregistrer » se grise. Boutons **↑ ↓ Supprimer Copier** sous chaque tweet, **« + Ajouter un tweet »** en bas.

---

## Et pour télécharger les images ?

C'est l'**étape 5** (export) : un bouton « Télécharger » produira les images PNG pour Instagram et le PDF pour LinkedIn, **identiques** à ce que vous voyez dans l'éditeur.
