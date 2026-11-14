# Tester l'étape 7 (abonnements, quotas, page des coûts) — guide pour débutant, Windows

Durée : environ 25 minutes. Tout se fait en **mode test Stripe** : aucun vrai paiement, aucune vraie carte.

> Rappel sur la **fenêtre noire** : on tape une commande, on appuie sur **Entrée**, et c'est terminé quand la ligne `C:\2222\Threadify-main>` réapparaît. Si le titre commence par « Sélection », appuyez sur **Échap**.

Gardez sous la main (dans un Bloc-notes) :
- votre **clé secrète Stripe de test** (commence par `sk_test_`) — Stripe → Développeurs → Clés API → « Révéler la clé de test » ;
- vos deux identifiants de tarifs : **Pro** `price_1UbfLUAPdDZksFFK8iDmwUo8` et **Expert** `price_1UbfLVAPdDZksFFKxxSsOcW5` ;
- l'**adresse e-mail** avec laquelle vous vous connectez à Threadify (pour la page cachée des coûts).

---

## Étape A — Arrêter le site s'il tourne

Fenêtre noire `next-server (v16.4.5)` : cliquez dedans, **Ctrl + C**, tapez **O**, **Entrée**. Gardez la fenêtre ouverte.

## Étape B — Télécharger la nouvelle version

**https://github.com/Mehdiii213/Threadify** → bouton vert **« <> Code »** → **« Download ZIP »**.

## Étape C — Décompresser par-dessus

Explorateur (**Windows + E**) → **Téléchargements** → **clic droit** sur le ZIP le plus récent → **« Extraire tout… »** → **« Parcourir… »** → **Ce PC** → double-clic **Disque local (C:)** → **un** clic sur **2222** → **« Sélectionner un dossier »** → **« Extraire »** → **« Remplacer les fichiers dans la destination »**.

✅ Le dossier `C:\2222\Threadify-main\docs` contient **`tester-etape-7.md`**.

## Étape D — Ajouter les réglages Stripe et administrateur dans `.env`

1. Dans la fenêtre noire, tapez `notepad .env` puis **Entrée**. Le Bloc-notes s'ouvre avec vos lignes actuelles (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `ANTHROPIC_API_KEY`) — **ne les modifiez pas**.
2. Cliquez **tout à la fin du texte**, appuyez **deux fois sur Entrée**, puis tapez (ou copiez-collez) ces lignes :
   ```
   STRIPE_SECRET_KEY="collez-ici-votre-cle-sk_test"
   STRIPE_PRICE_PRO="price_1UbfLUAPdDZksFFK8iDmwUo8"
   STRIPE_PRICE_EXPERT="price_1UbfLVAPdDZksFFKxxSsOcW5"
   STRIPE_WEBHOOK_SECRET=""
   ADMIN_EMAILS="votre-adresse@exemple.fr"
   ```
3. Sur la ligne `STRIPE_SECRET_KEY`, remplacez **uniquement** `collez-ici-votre-cle-sk_test` par votre clé (elle commence par `sk_test_`). Gardez les guillemets.
4. Sur la ligne `ADMIN_EMAILS`, remplacez `votre-adresse@exemple.fr` par **l'e-mail de votre compte Threadify**.
5. Laissez `STRIPE_WEBHOOK_SECRET=""` vide : il ne sert qu'une fois le site en ligne (étape 8).
6. **Ctrl + S**, puis fermez le Bloc-notes.

> ⚠️ La clé `sk_test_` est secrète : ne la montrez jamais (cachez-la sur vos captures).

## Étape E — Installer et mettre à jour la base

Une commande à la fois, en attendant que l'invite revienne :

```bash
npm install
```
✅ `added 2 packages` (les outils Stripe), des lignes jaunes `npm warn` (normales).

```bash
npx prisma migrate deploy
```
✅ Deux nouvelles migrations (`…_abonnements` et `…_couts`) puis **`All migrations have been successfully applied.`**

## Étape F — Lancer le site

```bash
npm run dev
```
✅ `✓ Ready`. Ne fermez pas la fenêtre.

---

## Étape G — La page « Tarifs » et votre compteur

1. Ouvrez **`localhost:3000`** : ✅ en haut à droite, un lien **« Tarifs »**. Cliquez dessus.
2. ✅ Trois offres côte à côte : **Gratuit 0 €**, **Pro 15 €** (encadrée en violet, « Le plus choisi »), **Expert 23 €**. Sur l'offre que vous avez, « Votre offre actuelle ».
3. Allez dans **« Mon espace »** : ✅ la 4e case affiche **« Générations ce mois-ci · offre Gratuit »** et un compteur comme **« 0 / 3 »**. Cliquez dessus : vous arrivez sur **« Mon abonnement »** (barre d'utilisation, boutons « Passer à Pro » et « Passer à Expert »).

## Étape H — Le filigrane de l'offre Gratuite

Ouvrez un **carrousel** : ✅ en haut à droite de chaque slide, la mention discrète **« Fait avec Threadify »**, et une phrase au-dessus des slides : « Offre Gratuite : les images portent la mention… ». Elle est aussi sur les images téléchargées.

## Étape I — Passer à Pro (paiement de test)

1. **« Mon abonnement »** → **« Passer à Pro — 15 € / mois »**.
2. ✅ La page de paiement **Stripe** s'ouvre, avec la mention **« Environnement de test »** et « S'abonner à Threadify Pro — 15,00 € par mois ».
3. Remplissez avec la **carte de test** de Stripe (elle ne débite rien) :
   - **Numéro de carte** : `4242 4242 4242 4242`
   - **Date d'expiration** : n'importe quelle date future, par exemple `12 / 34`
   - **CVC** : `123`
   - **Nom du titulaire** : votre nom
   - **Pays** : France
4. Si une case « Enregistrer mes informations avec Link » est cochée, vous pouvez la décocher.
5. Cliquez sur **« S'abonner »**.
6. ✅ Après quelques secondes, retour sur Threadify, page **« Mon abonnement »**, avec un message vert **« ✓ Merci ! Votre paiement a bien été pris en compte. »**, l'offre **Pro — 15 € / mois**, la date du **prochain renouvellement**, et le compteur **« 0 / 100 »**.
   - Si l'offre affiche encore « Gratuit », attendez 5 secondes et rechargez la page (**F5**).
7. Rouvrez un carrousel : ✅ la mention « Fait avec Threadify » a **disparu**.

## Étape J — Gérer l'abonnement (portail Stripe)

1. **« Mon abonnement »** → **« Gérer mon abonnement (carte, factures, résiliation) »**.
2. ✅ L'espace client **Stripe** s'ouvre : votre offre, votre carte de test, vos factures.
3. Pour tester la résiliation : **« Annuler l'abonnement »** → confirmez → **« Revenir à… »** (lien en haut à gauche).
4. ✅ De retour sur « Mon abonnement » : **« Résiliée : reste active jusqu'au … , puis retour à l'offre Gratuite. »**

## Étape K — Votre page cachée des coûts

1. Dans la barre d'adresse, tapez **`localhost:3000/admin/couts`** puis **Entrée**.
2. ✅ « **Administration · visible par vous seul** — Coûts de l'IA — (mois en cours) » : nombre de générations, coût de l'IA, revenus nets, marge, et un tableau par client.
3. Faites une génération (bouton « ✨ Générer » ou « ↻ Régénérer » sur une création), puis rechargez cette page : ✅ la génération apparaît avec son **coût réel**.
4. Si vous voyez « **Page introuvable** » : l'e-mail de la ligne `ADMIN_EMAILS` ne correspond pas exactement à celui de votre compte (ou le site n'a pas été relancé après la modification du `.env` : **Ctrl + C**, **O**, puis `npm run dev`).

---

## En cas de souci

| Ce que vous voyez | Que faire |
|---|---|
| « Le paiement n'est pas encore configuré sur ce site… » | Une des lignes `STRIPE_…` manque dans `.env` (étape D). Corrigez, puis relancez le site (Ctrl + C, O, `npm run dev`). |
| « Impossible d'ouvrir la page de paiement » | Vérifiez la clé `sk_test_` (copiée en entier ?) et les identifiants `price_…`. Le détail de l'erreur apparaît dans la fenêtre noire. |
| La page Stripe affiche un prix en dollars | Normal si votre connexion semble venir d'un autre pays : Stripe convertit automatiquement. En France, le prix est en euros. |
| Après le paiement, l'offre reste « Gratuit » | Rechargez « Mon abonnement » (F5) après quelques secondes. |
