# Tester l'étape 6 (tableau de bord, titres, dossiers, étiquettes) — guide pour débutant, Windows

Durée : environ 15 minutes. Votre `.env` ne change pas. **La base de données change** (titres, dossiers, étiquettes) : il faudra lancer `npx prisma migrate deploy`.

> Rappel sur la **fenêtre noire** : on tape une commande, on appuie sur **Entrée**, et c'est terminé quand la ligne `C:\2222\Threadify-main>` réapparaît. Si le titre commence par « Sélection », appuyez sur **Échap**.

---

## Étape A — Arrêter le site s'il tourne

Fenêtre noire `next-server (v16.4.5)` : cliquez dedans, **Ctrl + C**, tapez **O**, **Entrée**. Gardez la fenêtre ouverte.

## Étape B — Télécharger la nouvelle version

**https://github.com/Mehdiii213/Threadify** → bouton vert **« <> Code »** → **« Download ZIP »**.

## Étape C — Décompresser par-dessus

Explorateur (**Windows + E**) → **Téléchargements** → **clic droit** sur le ZIP le plus récent → **« Extraire tout… »** → **« Parcourir… »** → **Ce PC** → double-clic **Disque local (C:)** → **un** clic sur **2222** → **« Sélectionner un dossier »** → **« Extraire »** → **« Remplacer les fichiers dans la destination »**.

✅ Le dossier `C:\2222\Threadify-main\docs` contient **`tester-etape-6.md`**.

## Étape D — Installer et mettre à jour la base

Dans la fenêtre noire, une commande à la fois (attendez que l'invite revienne) :

```bash
npm install
```
✅ `up to date` (rien de nouveau à installer cette fois), puis l'invite revient.

```bash
npx prisma migrate deploy
```
✅ `Applying migration `20261109101118_organisation`` puis **`All migrations have been successfully applied.`**

> ⚠️ Tapez bien `npx` **une seule fois**. Si la fenêtre demande `Need to install the following packages: npx… Ok to proceed?`, répondez **n** puis **Entrée**, et retapez la commande.

## Étape E — Lancer le site

```bash
npm run dev
```
✅ `✓ Ready`. Ne fermez pas la fenêtre.

---

## Étape F — Découvrir le tableau de bord

Ouvrez **`localhost:3000`** → **« Mon espace »**.

✅ Vous voyez :
- en haut : « Bonjour {prénom} 👋 », **+ Nouvelle création**, **Se déconnecter** ;
- **4 cases de chiffres** : Créations, Générées, Brouillons, Générées ce mois-ci ;
- **à gauche**, l'encadré **DOSSIERS** : « 🗂️ Toutes les créations », « 📄 Sans dossier » (avec leur nombre), et **« + Nouveau dossier »** ;
- **à droite**, « Mes créations » : une barre de **recherche**, des **filtres** (Tous les formats / Instagram / LinkedIn / Threads X ; Toutes / Générées / Brouillons) et vos créations en **cartes**. Un carrousel montre sa **couverture avec son design**, un thread son premier tweet, un brouillon le début de votre texte.

## Étape G — Filtrer et rechercher

1. Cliquez sur **Instagram** : ✅ seuls vos carrousels Instagram restent ; le bouton devient violet ; « Effacer les filtres » apparaît.
2. Cliquez sur **Brouillons** : ✅ les deux filtres se combinent.
3. Cliquez sur **« Effacer les filtres »**.
4. Tapez un mot de l'un de vos textes dans la barre de recherche → **« Rechercher »** : ✅ seules les créations qui contiennent ce mot restent.

## Étape H — Créer un dossier et y ranger une création

1. **« + Nouveau dossier »** : une petite fenêtre demande un nom. Tapez par exemple `Client Boulangerie` → **OK**. ✅ Le dossier apparaît à gauche.
2. Sur une carte, cliquez sur les **trois petits points « ⋯ »** (à droite du titre) : un menu s'ouvre.
3. Sous **« Déplacer vers »**, cliquez sur **Client Boulangerie**.
4. Cliquez sur le dossier **Client Boulangerie** à gauche : ✅ votre création y est.
5. Sous la liste des dossiers : **« Renommer le dossier »** et **« Supprimer le dossier »**. Supprimer un dossier **ne supprime pas** ses créations : elles passent « Sans dossier ».

## Étape I — Renommer, dupliquer, supprimer

Toujours avec le menu **« ⋯ »** d'une carte :
- **✏️ Renommer** : tapez un nouveau titre → **OK**. ✅ La carte affiche le nouveau titre.
- **📄 Dupliquer** : ✅ une copie apparaît, avec « (copie) » dans le titre, le même texte et le même design.
- **🗑️ Supprimer** : une fenêtre demande confirmation. **Annuler** ne supprime rien ; **OK** supprime définitivement.

## Étape J — Étiquettes, titre et dossier depuis une création

1. Cliquez sur une carte pour l'ouvrir.
2. ✅ Sous le titre, un encadré avec **Titre**, **Dossier** et **Étiquettes**.
3. Dans **Étiquettes**, tapez par exemple `conseils` → **Ajouter** (ou touche **Entrée**). ✅ `#conseils` apparaît, et en bas « ✓ Étiquettes enregistrées ». Le **×** à côté d'une étiquette la retire.
4. Changez le **Dossier** dans la liste : ✅ « ✓ Dossier modifié ».
5. Modifiez le **Titre** puis cliquez ailleurs : ✅ « ✓ Titre enregistré ».
6. Retournez dans **« Mon espace »** : ✅ une nouvelle ligne de filtres apparaît avec vos étiquettes (**#conseils**…). Cliquez dessus pour ne voir que ces créations.

## Étape K — Les pages

Quand vous aurez plus de **12 créations**, des boutons **« ← Page précédente »** et **« Page suivante → »** apparaîtront en bas.
