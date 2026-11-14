# Mettre à jour les prix des abonnements sur votre ordinateur (Windows) — guide pour débutant

Durée : environ 10 minutes. Nouveaux prix : **Pro 15 € / mois** (au lieu de 12 €) et **Expert 23 € / mois** (au lieu de 19 €).

> Ce qui a déjà été fait par Claude : les prix affichés sur le site sont modifiés, et deux **nouveaux tarifs** ont été créés dans votre compte Stripe (mode test). Chez Stripe, un prix ne peut pas être modifié : on en crée un nouveau, et l'ancien est **archivé** (il ne peut plus être choisi par de nouveaux clients ; les abonnements déjà en cours continuent à l'ancien prix).

Il vous reste deux choses à faire : récupérer la nouvelle version du site, et **remplacer les deux identifiants de tarifs** dans votre fichier `.env`.

> Rappel sur la **fenêtre noire** : on tape une commande, on appuie sur **Entrée**, et c'est terminé quand la ligne `C:\2222\Threadify-main>` réapparaît.

---

## Étape A — Arrêter le site s'il tourne

Fenêtre noire `next-server (v16.4.5)` : cliquez dedans, **Ctrl + C**, tapez **O**, **Entrée**. Gardez la fenêtre ouverte.

## Étape B — Télécharger et décompresser la nouvelle version

1. **https://github.com/Mehdiii213/Threadify** → bouton vert **« <> Code »** → **« Download ZIP »**.
2. Explorateur (**Windows + E**) → **Téléchargements** → **clic droit** sur le ZIP le plus récent → **« Extraire tout… »** → **« Parcourir… »** → **Ce PC** → **Disque local (C:)** → **un** clic sur **2222** → **« Sélectionner un dossier »** → **« Extraire »** → **« Remplacer les fichiers dans la destination »**.

✅ Le dossier `C:\2222\Threadify-main\docs` contient **`changer-les-prix.md`**.

## Étape C — Remplacer les identifiants de tarifs dans `.env`

1. Dans la fenêtre noire, tapez `notepad .env` puis **Entrée**. Le Bloc-notes s'ouvre.
2. Trouvez les deux lignes `STRIPE_PRICE_PRO=…` et `STRIPE_PRICE_EXPERT=…`.
3. Remplacez-les **entièrement** par ces deux lignes (sélectionnez chaque ligne à la souris, puis collez) :
   ```
   STRIPE_PRICE_PRO="price_1UbfLUAPdDZksFFK8iDmwUo8"
   STRIPE_PRICE_EXPERT="price_1UbfLVAPdDZksFFKxxSsOcW5"
   ```
4. Ne touchez à **aucune autre ligne**. **Ctrl + S**, puis fermez le Bloc-notes.

> Si vous oubliez cette étape, le site affichera 15 € mais Stripe ne trouvera plus l'ancien tarif archivé : « Impossible d'ouvrir la page de paiement ».

## Étape D — Installer et lancer

```bash
npm install
```
✅ L'invite revient (quelques `npm warn` jaunes possibles, normaux).

```bash
npx prisma migrate deploy
```
✅ **`All migrations have been successfully applied.`** (ou « No pending migrations » si vous l'aviez déjà fait).

```bash
npm run dev
```
✅ `✓ Ready`. Ne fermez pas la fenêtre.

## Étape E — Vérifier dans le navigateur

1. Ouvrez **`localhost:3000/tarifs`** : ✅ **Gratuit 0 €**, **Pro 15 €**, **Expert 23 €**.
2. Connectez-vous, allez dans **« Mon abonnement »** (case « Générations ce mois-ci » de « Mon espace ») : ✅ boutons **« Passer à Pro — 15 € / mois »** et **« Passer à Expert — 23 € / mois »**.
3. Cliquez sur **« Passer à Pro — 15 € / mois »** : ✅ la page Stripe affiche **« S'abonner à Threadify Pro — 15,00 € par mois »**. Vous pouvez revenir en arrière avec la flèche ← en haut à gauche sans payer.

> Si votre compte a déjà un abonnement de test à 12 €, il reste à 12 € : c'est normal, seuls les **nouveaux** abonnements prennent le nouveau prix.

## En cas de souci

| Ce que vous voyez | Que faire |
|---|---|
| « Impossible d'ouvrir la page de paiement » | Vérifiez les deux lignes `STRIPE_PRICE_…` du `.env` (étape C), puis relancez le site (Ctrl + C, O, `npm run dev`). |
| La page Stripe affiche encore 12 € | Le site n'a pas été relancé après la modification du `.env` : Ctrl + C, O, `npm run dev`. |
