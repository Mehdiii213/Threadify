# Tester l'étape 5 (télécharger et publier) — guide pour débutant, Windows

Durée : environ 15 minutes. Votre `.env` ne change pas, et **la base de données non plus** (pas de `prisma migrate` cette fois).

> Rappel sur la **fenêtre noire** : on tape une commande, on appuie sur **Entrée**, et c'est terminé quand la ligne `C:\2222\Threadify-main>` réapparaît. Si le titre commence par « Sélection », appuyez sur **Échap**.

---

## Étape A — Arrêter le site s'il tourne

Fenêtre noire `next-server (v16.4.5)` : cliquez dedans, **Ctrl + C**, tapez **O**, **Entrée**. Gardez la fenêtre ouverte.

## Étape B — Télécharger la nouvelle version

**https://github.com/Mehdiii213/Threadify** → bouton vert **« <> Code »** → **« Download ZIP »**.

## Étape C — Décompresser par-dessus

Explorateur (**Windows + E**) → **Téléchargements** → **clic droit** sur le ZIP le plus récent → **« Extraire tout… »** → **« Parcourir… »** → **Ce PC** → double-clic **Disque local (C:)** → **un** clic sur **2222** → **« Sélectionner un dossier »** → **« Extraire »** → **« Remplacer les fichiers dans la destination »**.

✅ Le dossier `C:\2222\Threadify-main\docs` contient **`tester-etape-5.md`**.

## Étape D — Installer les nouveaux outils

Cette version ajoute 3 outils (fabriquer les images, le ZIP et le PDF). Dans la fenêtre noire :

```bash
npm install
```
✅ Une ligne du type `added 36 packages`, des lignes jaunes `npm warn` (normales), puis l'invite revient.

## Étape E — Lancer le site

```bash
npm run dev
```
✅ `✓ Ready`. Ne fermez pas la fenêtre.

---

## Étape F — Télécharger un carrousel Instagram

1. Ouvrez **`localhost:3000`** → **« Mon espace »** → votre **Carrousel Instagram**.
2. ✅ En haut des slides (à droite des réglages), un encadré violet clair avec :
   - un bouton violet **« ⬇ Télécharger les images (ZIP) »** ;
   - un bouton blanc **« ⬇ Télécharger le PDF »** ;
   - la phrase « Instagram : une image PNG par slide (1080 × 1350), numérotées dans l'ordre. »
3. Cliquez sur **« ⬇ Télécharger les images (ZIP) »**.
   - ✅ Le message « Préparation du téléchargement… » puis « Préparation de l'image 1 sur 8… » s'affiche.
   - ⏳ **La toute première fois, cela peut prendre jusqu'à 30 secondes** (le site charge ses outils ; c'est seulement en mode test sur votre ordinateur). Les fois suivantes : 1 à 2 secondes.
4. ✅ Votre navigateur télécharge un fichier comme **`threadify-5-erreurs-qui-freinent-ton-lancement.zip`** (Chrome/Edge l'affichent en haut à droite, avec une flèche ⬇).
5. Ouvrez-le : Explorateur → **Téléchargements** → **double-clic** sur le ZIP.
   ✅ Vous voyez **`slide-01.png`, `slide-02.png`, …** Double-cliquez sur `slide-01.png` : c'est votre couverture, **exactement comme dans l'éditeur** (mêmes couleurs, même police, votre signature).
6. Pour les utiliser : **clic droit** sur le ZIP → **« Extraire tout… »** → **« Extraire »** : les images sont maintenant dans un dossier normal.

### Télécharger une seule slide
À côté de chaque slide, le petit bouton **⬇** (avant « Supprimer ») télécharge **cette slide seule** en PNG. Pratique pour la renvoyer à quelqu'un ou la retoucher.

### Si vous avez modifié sans enregistrer
Le téléchargement prend **ce qui est affiché à l'écran**. Une phrase vous rappelle alors d'enregistrer vos modifications.

---

## Étape G — Télécharger un carrousel LinkedIn

1. **« Mon espace »** → un **Carrousel LinkedIn** (créez-en un si besoin : « + Nouvelle création » → format **Carrousel LinkedIn** → « Continuer » → « ✨ Générer »).
2. ✅ Cette fois, le bouton violet (principal) est **« ⬇ Télécharger le PDF »**.
3. Cliquez dessus : ✅ un fichier **`.pdf`** est téléchargé. Double-cliquez dessus : il s'ouvre dans votre navigateur ou votre lecteur PDF, **une page par slide**.

---

## Étape H — Télécharger un thread X

Ouvrez votre **Thread X** : ✅ à côté de « Copier tout le thread », un bouton **« ⬇ Télécharger en .txt »**. Cliquez : un fichier texte avec tous les tweets numérotés est téléchargé.

---

## Publier vos carrousels

### Sur Instagram, depuis votre téléphone (le plus simple)
1. **Envoyez les images sur votre téléphone** : par exemple en vous les envoyant par e-mail ou WhatsApp, ou via Google Drive / OneDrive, puis **enregistrez-les** dans la galerie (Photos).
2. Ouvrez **Instagram** → touchez le **« + »** (en bas au centre ou en haut) → **« Publication »**.
3. Touchez l'icône **« Sélectionner plusieurs »** (deux carrés superposés).
4. Touchez les images **dans l'ordre** : slide 1, puis 2, puis 3… (un numéro apparaît sur chaque image sélectionnée).
5. **« Suivant »** → (filtres : passez) **« Suivant »** → écrivez votre légende → **« Partager »**.

### Sur Instagram, depuis l'ordinateur
**instagram.com** → **« Créer »** (le « + » dans le menu de gauche) → **« Publication »** → **« Sélectionner sur l'ordinateur »** → sélectionnez toutes les images (cliquez sur `slide-01.png`, puis **Maj + clic** sur la dernière) → **« Ouvrir »** → vérifiez l'ordre → **« Suivant »** → **« Suivant »** → légende → **« Partager »**.

### Sur LinkedIn (le PDF)
**linkedin.com** → **« Commencer un post »** → icône **« + »** ou **« … »** (Plus) → **« Ajouter un document »** → **« Choisir un fichier »** → votre PDF → donnez un **titre** au document (il s'affiche au-dessus du carrousel) → **« Terminé »** → écrivez votre texte → **« Publier »**.
