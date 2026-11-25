# Activer et tester l'abonnement annuel (−30 %) — guide pour débutant

Durée : environ 15 minutes. Tout se fait en **mode test Stripe** (carte `4242…`).

**Nouveaux prix annuels** : Pro **126 €/an** (au lieu de 180 €), Expert **193 €/an** (au lieu de 276 €). Les quotas restent mensuels.

Ce que Claude a déjà fait : les 2 prix annuels sont créés dans votre compte Stripe (mode test), et l'espace client Stripe autorise désormais le changement d'offre (nécessaire au bouton « Passer à l'annuel »).

---

## Partie A — Le site en ligne (`threadify.fr`)

1. **Netlify** → projet **threadify-fr** → **« Gérer »** → « Find a setting » : `environment` → **Environment variables**.
2. Ajoutez **deux clés** (bouton « Add a variable »), en remplissant les cases **« Live app »** et **« Versions »** (⚠️ pas « Your computer ») :

   | Clé | Valeur |
   |---|---|
   | `STRIPE_PRICE_PRO_ANNUAL` | `price_1UfkxTAPdDZksFFKNEW7kkBH` |
   | `STRIPE_PRICE_EXPERT_ANNUAL` | `price_1UfkxTAPdDZksFFKqjwgGqM6` |

3. Prévenez Claude (« c'est fait ») : il envoie la mise à jour, et Netlify reconstruit le site avec ces clés (≈ 5 minutes).

## Partie B — Votre ordinateur (facultatif)

Pour avoir aussi l'annuel sur `localhost` :
1. Téléchargez le nouveau ZIP et décompressez-le par-dessus (`C:\2222`), comme d'habitude.
2. Fenêtre noire : `notepad .env` → ajoutez **à la fin** ces deux lignes → **Ctrl + S** :
   ```
   STRIPE_PRICE_PRO_ANNUAL="price_1UfkxTAPdDZksFFKNEW7kkBH"
   STRIPE_PRICE_EXPERT_ANNUAL="price_1UfkxTAPdDZksFFKqjwgGqM6"
   ```
3. Puis, une commande à la fois : `npm install`, `npx prisma migrate deploy` (✅ une migration `…_rappel_renouvellement`), `npm run dev`.

---

## Partie C — Tester sur `https://threadify.fr`

1. **Page Tarifs** (`threadify.fr/tarifs`) : ✅ un interrupteur **« Mensuel / Annuel −30 % »**. Cliquez sur **Annuel** : ✅ Pro **10,50 € / mois** (15 € barré), « Facturé 126 € par an · 54 € économisés » ; Expert **16,08 € / mois**, « Facturé 193 € par an ».
2. **Passer de mensuel à annuel** (votre compte est en Pro mensuel depuis le test de paiement) : **« Mon abonnement »** → ✅ un encadré vert **« Passez à l'annuel et économisez 54 € par an »** → **« Passer à l'annuel — 126 € / an »**.
   - ✅ La page Stripe s'ouvre et affiche le **montant à payer aujourd'hui** (126 € moins le temps restant de votre mois en cours) → **« Confirmer »**.
   - ✅ Retour sur « Mon abonnement » : **« Pro — 126 € / an (abonnement annuel) »**, prochain renouvellement dans un an, l'encadré vert a disparu.
3. **Nouvel abonnement annuel** (facultatif) : avec un autre compte en offre Gratuite, « Mon abonnement » → ✅ 4 boutons (Pro et Expert, mensuel et annuel) → **« Annuel — 126 € / an (−30 %) »** → ✅ Stripe affiche « 126,00 € par an ».
4. **Parrainage + annuel** (facultatif) : un filleul qui choisit l'annuel voit sur Stripe ✅ « Parrainage (−20 % d'un mois) − 3,00 € » (Pro) ou − 4,60 € (Expert).
5. **Page des coûts** (`/admin/couts`) : ✅ un abonné annuel apparaît en « Pro (annuel) », avec un revenu mensuel égal à 1/12 de son prix.

## À savoir

- **Rappel avant renouvellement (obligation légale, loi Chatel)** : environ un mois avant chaque renouvellement annuel, l'abonné reçoit automatiquement un e-mail (date, montant, lien pour résilier). C'est la tâche quotidienne GitHub « Réveil de la base » qui s'en charge.
- **Conditions générales** : mises à jour (paiement annuel, renouvellement, rappel, pas de remboursement de la période commencée hors rétractation).
- **Pour les vrais paiements (étape 8c)** : il faudra créer les mêmes prix annuels en mode réel et activer « changement d'offre » dans le portail client Stripe réel — Claude vous guidera.
