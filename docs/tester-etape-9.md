# Tester l'étape 9 (programme d'affiliation) — guide pour débutant, Windows

Durée : environ 25 minutes. Tout se fait en **mode test Stripe** : aucun vrai paiement.

**Rappel des règles choisies** : l'affilié gagne **30 %** du prix hors TVA payé par ses filleuls, pendant leurs **12 premiers mois** ; le filleul a **−20 % sur son premier mois** ; chaque commission devient « disponible » **30 jours** après le paiement ; vous faites le virement vous-même dès **50 €**. Aucun cookie : le code est simplement prérempli dans le formulaire d'inscription.

> Rappel sur la **fenêtre noire** : on tape une commande, on appuie sur **Entrée**, et c'est terminé quand la ligne `C:\2222\Threadify-main>` réapparaît. Si le titre commence par « Sélection », appuyez sur **Échap**.

Pour ce test, vous jouerez deux personnes :
- **vous-même** (votre compte habituel), dans votre navigateur normal : l'**affilié** ;
- un **filleul**, dans une **fenêtre de navigation privée** (Chrome : **Ctrl + Maj + N** ; Edge : **Ctrl + Maj + N** ; Firefox : **Ctrl + Maj + P**) avec une adresse inventée, par exemple `filleul1@exemple.fr`.

---

## Étape A — Arrêter le site s'il tourne

Fenêtre noire `next-server (v16.4.5)` : cliquez dedans, **Ctrl + C**, tapez **O**, **Entrée**. Gardez la fenêtre ouverte.

## Étape B — Télécharger et décompresser la nouvelle version

1. **https://github.com/Mehdiii213/Threadify** → bouton vert **« <> Code »** → **« Download ZIP »**.
2. Explorateur (**Windows + E**) → **Téléchargements** → **clic droit** sur le ZIP le plus récent → **« Extraire tout… »** → **« Parcourir… »** → **Ce PC** → **Disque local (C:)** → **un** clic sur **2222** → **« Sélectionner un dossier »** → **« Extraire »** → **« Remplacer les fichiers dans la destination »**.

✅ Le dossier `C:\2222\Threadify-main\docs` contient **`tester-etape-9.md`**. Aucune ligne à ajouter dans `.env`.

## Étape C — Installer et mettre à jour la base

```bash
npm install
```
✅ L'invite revient (quelques `npm warn` jaunes possibles, normaux).

```bash
npx prisma migrate deploy
```
✅ Une nouvelle migration **`…_affiliation`** (et **`…_securite`** si vous n'aviez pas encore testé l'étape 8a), puis **`All migrations have been successfully applied.`**

```bash
npm run dev
```
✅ `✓ Ready`. Ne fermez pas la fenêtre.

---

## Étape D — Votre page « Affiliation » (vous, l'affilié)

1. Ouvrez **`localhost:3000`**, connectez-vous à votre compte, allez dans **« Mon espace »**.
2. ✅ Sous « Bonjour … », à côté de « Mon compte » : un lien **« Affiliation (gagnez 30 %) »**. Cliquez dessus.
3. ✅ Page **« Programme d'affiliation »** :
   - un cadre **« Votre lien de parrainage »** avec une adresse du genre `http://localhost:3000/inscription?ref=MEHDI7K2Q` et un bouton **« Copier le lien »** ;
   - **votre code** (ex. `MEHDI7K2Q`) ;
   - cinq cases : Inscrits avec votre lien **0**, Abonnés **0**, En attente **0,00 €**, Disponible **0,00 €**, Déjà versé **0,00 €** ;
   - un tableau « Vos commissions » vide.
4. Cliquez sur **« Copier le lien »** : ✅ le bouton affiche « ✓ Copié ».

## Étape E — Le filleul s'inscrit avec votre lien

1. Ouvrez une **fenêtre de navigation privée** (voir plus haut).
2. Cliquez dans la barre d'adresse, **Ctrl + V** (votre lien), **Entrée**.
3. ✅ Page **« Créer un compte »** avec un cadre violet : **« 🎁 Vous êtes invité par [votre prénom] : bénéficiez de −20 % sur votre premier mois… »**, et le champ **« Code de parrainage »** déjà rempli avec votre code.
4. Remplissez : prénom `Léo`, adresse `filleul1@exemple.fr` (inventée), mot de passe `motdepasse123` → **« Créer mon compte »**.
5. ✅ Vous arrivez sur « Nouvelle création » (le bandeau jaune « Confirmez votre adresse » est normal, ignorez-le).

> Test facultatif : un code inventé (ex. `FAUXCODE`) tapé dans ce champ affiche ✅ « Ce code de parrainage n'existe pas… » et le compte n'est pas créé.

## Étape F — Le filleul s'abonne avec la réduction

1. Toujours dans la fenêtre privée : **« Mon espace »** → la case **« Générations ce mois-ci »** → page **« Mon abonnement »**.
2. ✅ Un cadre violet : **« 🎁 Parrainage : −20 % sur votre premier mois, appliqués automatiquement sur la page de paiement. »**
3. Cliquez sur **« Passer à Pro — 15 € / mois »**.
4. ✅ Page Stripe « Environnement de test » : **Threadify Pro 15,00 €**, une ligne **« Parrainage −20 % (1er mois) − 3,00 € »**, **Total dû aujourd'hui 12,00 €**, puis « 15,00 € par mois à partir du mois suivant ».
5. Carte de test : `4242 4242 4242 4242`, date `12 / 34`, CVC `123`, un nom, pays France → **« S'abonner »**.
6. ✅ Retour sur « Mon abonnement » : offre **Pro**.

## Étape G — Votre commission apparaît (vous, l'affilié)

1. Revenez dans **votre** fenêtre normale, sur la page **« Affiliation »**, et rechargez-la (**F5**).
2. ✅ Inscrits **1**, Abonnés **1**, **En attente 3,00 €** (30 % de 10,00 € hors TVA, puisque le filleul a payé 12,00 € TTC).
3. ✅ Dans « Vos commissions » : la date du jour, le filleul **masqué** (`fi•••@exemple.fr`), **12,00 €** payés, **3,00 €** de commission, statut **« En attente jusqu'au … »** (dans 30 jours).

## Étape H — Votre page cachée des affiliés (administration)

1. Dans votre fenêtre normale, tapez **`localhost:3000/admin/affiliation`** puis **Entrée**.
2. ✅ « **Administration · visible par vous seul — Affiliés** » : trois cases (En attente **3,00 €**, À verser **0,00 €**, Déjà versé **0,00 €**) et une ligne avec votre nom, votre code, **1** filleul.
3. Dans 30 jours, la somme passera dans « À verser » et un bouton vert **« Marquer comme versé »** apparaîtra : vous ferez alors le virement depuis votre banque, puis cliquerez sur ce bouton. La ligne devient verte quand un affilié atteint 50 €.
4. Allez sur **`localhost:3000/admin/couts`** : ✅ une nouvelle case **« Commissions d'affiliation 3,00 € »**, déduite de la **Marge**.

> « Page introuvable » ? Même cause qu'à l'étape 7 : l'e-mail de la ligne `ADMIN_EMAILS` du `.env` doit être exactement celui de votre compte.

## Étape I — (Facultatif) Un remboursement annule la commission

1. Dans le tableau de bord Stripe (mode test) : **Transactions** (ou « Paiements ») → cliquez sur le paiement de **12,00 €** de `filleul1@exemple.fr` → bouton **« Rembourser »** → confirmez.
2. Rechargez votre page **« Affiliation »** : ✅ la commission affiche **« Annulée (remboursement) »** et « En attente » repasse à **0,00 €**.

## Étape J — Les conditions du programme

Tout en bas de n'importe quelle page, dans le pied de page : ✅ un nouveau lien **« Affiliation »** → page **« Conditions du programme d'affiliation »** (règles, versement, déclaration des revenus ; les passages jaunes sont à compléter avec vos informations, comme pour les autres pages légales).

---

## En cas de souci

| Ce que vous voyez | Que faire |
|---|---|
| Pas de cadre violet « Vous êtes invité par… » | Le lien a été mal collé : il doit se terminer par `?ref=` suivi de votre code. Ou vous étiez déjà connecté : utilisez bien une fenêtre **privée**. |
| Page Stripe sans la ligne « Parrainage −20 % » | Le compte du filleul n'a pas été créé avec le code, ou il a déjà été abonné. Recommencez avec une nouvelle adresse inventée (`filleul2@exemple.fr`). |
| La commission n'apparaît pas | Rechargez la page « Affiliation » (F5) quelques secondes après le paiement. Le détail d'une éventuelle erreur s'affiche dans la fenêtre noire (`[affiliation] …`). |
| `npx prisma migrate deploy` affiche une erreur rouge | Vérifiez que le ZIP a bien été décompressé dans `C:\2222`, puis recommencez l'étape C. |
