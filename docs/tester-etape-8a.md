# Tester l'étape 8a (e-mails, mot de passe oublié, compte, pages légales) — guide pour débutant, Windows

Durée : environ 25 minutes. Rien à acheter, rien à configurer chez Stripe.

> Rappel sur la **fenêtre noire** : on tape une commande, on appuie sur **Entrée**, et c'est terminé quand la ligne `C:\2222\Threadify-main>` réapparaît. Si le titre commence par « Sélection », appuyez sur **Échap**.

**Bon à savoir avant de commencer** : sur votre ordinateur, le site **n'envoie pas de vrais e-mails** (il faudrait un compte Resend, ce sera fait à la mise en ligne). À la place, le contenu de chaque e-mail **s'affiche dans la fenêtre noire** du site, avec son lien. Ce guide vous montre comment le récupérer.

---

## Étape A — Arrêter le site s'il tourne

Fenêtre noire `next-server (v16.4.5)` : cliquez dedans, **Ctrl + C**, tapez **O**, **Entrée**. Gardez la fenêtre ouverte.

## Étape B — Télécharger la nouvelle version

**https://github.com/Mehdiii213/Threadify** → bouton vert **« <> Code »** → **« Download ZIP »**.

## Étape C — Décompresser par-dessus

Explorateur (**Windows + E**) → **Téléchargements** → **clic droit** sur le ZIP le plus récent → **« Extraire tout… »** → **« Parcourir… »** → **Ce PC** → double-clic **Disque local (C:)** → **un** clic sur **2222** → **« Sélectionner un dossier »** → **« Extraire »** → **« Remplacer les fichiers dans la destination »**.

✅ Le dossier `C:\2222\Threadify-main\docs` contient **`tester-etape-8a.md`**.

> Votre fichier `.env` n'est pas touché. Aucune ligne à ajouter cette fois.

## Étape D — Installer et mettre à jour la base

Une commande à la fois, en attendant que l'invite revienne :

```bash
npm install
```
✅ Quelques lignes, éventuellement des `npm warn` jaunes (normaux), puis l'invite revient.

```bash
npx prisma migrate deploy
```
✅ Une nouvelle migration **`…_securite`** puis **`All migrations have been successfully applied.`**

## Étape E — Lancer le site

```bash
npm run dev
```
✅ `✓ Ready`. Ne fermez pas la fenêtre : c'est **dans cette fenêtre** qu'apparaîtront les e-mails.

---

## Étape F — Le pied de page et les pages légales

1. Ouvrez **`localhost:3000`** et descendez tout en bas de la page.
2. ✅ Une barre blanche : à gauche « © Threadify — carrousels et threads par IA », à droite les liens **Tarifs · Mentions légales · Conditions générales · Confidentialité**.
3. Cliquez sur chacun des trois liens légaux. ✅ Une page de texte avec des **passages surlignés en jaune** entre crochets, comme `[Numéro SIRET]` : ce sont les informations que **vous** devrez me donner avant la mise en ligne.
4. ✅ L'onglet du navigateur affiche la **nouvelle petite icône violette** (deux cartes blanches) au lieu du triangle noir.

## Étape G — Confirmer l'adresse e-mail de votre compte

Votre compte actuel a été créé avant cette étape : son adresse n'est pas encore « confirmée ».

1. Connectez-vous si besoin. ✅ Sous l'en-tête, un **bandeau jaune** : « 📩 Confirmez votre adresse e-mail (…) … **Renvoyer l'e-mail** ».
2. Ouvrez une création et cliquez sur **« ✨ Générer »** ou **« ↻ Régénérer »**. ✅ Message rouge : « Confirmez d'abord votre adresse e-mail… **Renvoyer l'e-mail →** ». L'IA n'a pas été appelée, donc rien ne vous a été facturé.
3. Cliquez sur **« Renvoyer l'e-mail → »**. Vous arrivez sur **« Mon compte »** : nom, adresse avec la pastille **« À confirmer »**, puis le bouton violet **« Renvoyer l'e-mail de confirmation »**. Cliquez dessus.
4. ✅ Message vert « ✓ E-mail envoyé à … ».
5. **Allez dans la fenêtre noire.** ✅ Vous y voyez un bloc de ce genre :
   ```
   [e-mail] (non envoyé : RESEND_API_KEY absente du .env)
     À : votre-adresse@...
     Objet : Confirmez votre adresse e-mail — Threadify
     Lien : http://localhost:3000/api/auth/verify-email?token=eyJhbGciOi...
   ```
6. **Copiez le lien** (il est très long et peut tenir sur plusieurs lignes) :
   - avec la souris, **maintenez le clic** juste avant `http` et **glissez** jusqu'à la fin du lien (dernier caractère avant la ligne vide) ; le texte sélectionné devient blanc sur fond clair et le titre de la fenêtre commence par **« Sélection »** ;
   - appuyez sur **Entrée** : le texte est copié et la sélection disparaît.
7. Retournez dans le navigateur, cliquez dans la **barre d'adresse**, **Ctrl + V**, **Entrée**.
8. ✅ Vous arrivez sur **« Mon espace »** avec un message vert : **« ✓ Votre adresse e-mail est confirmée. »** Le bandeau jaune a disparu, et **« Générer »** fonctionne de nouveau.

> Si le navigateur affiche une page blanche ou une erreur, c'est souvent qu'il manque la fin du lien. Recommencez la copie en allant bien jusqu'au bout.

## Étape H — « Mot de passe oublié »

1. Cliquez sur **« Mon espace »** → **« Se déconnecter »**.
2. Sur la page **« Connexion »** : ✅ sous le mot de passe, un lien **« Mot de passe oublié ? »**. Cliquez dessus.
3. Tapez l'adresse e-mail de votre compte → **« Recevoir le lien »**. ✅ Message vert « Si un compte existe avec l'adresse … ».
4. Dans la fenêtre noire : ✅ un nouveau bloc **« Objet : Réinitialisez votre mot de passe »** avec un lien `…/api/auth/reset-password/…`. Copiez-le comme à l'étape G et collez-le dans le navigateur.
5. ✅ Page **« Nouveau mot de passe »**. Tapez deux fois un nouveau mot de passe (8 caractères minimum) → **« Enregistrer le nouveau mot de passe »**.
6. ✅ « Votre mot de passe a été changé… » → **« Se connecter »** → connectez-vous avec le **nouveau** mot de passe. ✅ Vous arrivez dans « Mon espace ».
7. (Facultatif) Recollez le même lien dans le navigateur : ✅ « Ce lien n'est plus valable » (un lien ne sert qu'une fois).

## Étape I — La page « Mon compte »

1. Dans **« Mon espace »**, à côté de votre adresse : ✅ un lien **« Mon compte »**. Cliquez dessus.
2. ✅ Trois cadres : **Informations** (pastille verte **« ✓ Confirmée »**), **Changer de mot de passe**, et un cadre rouge **Supprimer mon compte**.
3. ⚠️ **Ne supprimez pas votre compte principal.** Pour tester la suppression : déconnectez-vous, créez un **compte de test** (une autre adresse, même inventée, comme `test@exemple.fr`), allez dans **Mon compte**, tapez son mot de passe et le mot **SUPPRIMER**, puis cliquez sur **« Supprimer définitivement mon compte »**.
4. ✅ Page « Votre compte a été supprimé ». Essayez de vous reconnecter avec ce compte de test : ✅ « E-mail ou mot de passe incorrect » (il n'existe plus).

> Si le compte supprimé avait un abonnement Pro ou Expert, il est **résilié immédiatement chez Stripe**. Je l'ai vérifié de mon côté en mode test.

## Étape J — L'aperçu de partage (facultatif)

Tapez **`localhost:3000/opengraph-image`** dans la barre d'adresse. ✅ L'image violette « Une idée → un carrousel prêt à publier » : c'est elle qui s'affichera quand quelqu'un partagera le lien du site sur LinkedIn ou WhatsApp, une fois le site en ligne.

---

## Ce qui ne se teste pas sur votre ordinateur

- **La limitation des tentatives de connexion** : elle ne s'active qu'en version « production », donc une fois en ligne. Après 5 essais de mot de passe ratés en 5 minutes, le site répond « Trop de tentatives… patientez quelques minutes ». Je l'ai vérifiée de mon côté.
- **Les vrais e-mails** : ils partiront une fois Resend configuré (étape 8b).

## En cas de souci

| Ce que vous voyez | Que faire |
|---|---|
| Aucun bloc `[e-mail]` dans la fenêtre noire | Remontez dans la fenêtre avec la molette de la souris : le bloc est peut-être plus haut. Sinon, recliquez sur « Renvoyer l'e-mail de confirmation ». |
| `npx prisma migrate deploy` affiche une erreur rouge | Vérifiez que le ZIP a bien été décompressé dans `C:\2222` (et pas `C:\2222\Threadify-main\Threadify-main`), puis recommencez l'étape D. |
| Page « This page couldn't load » | Arrêtez le site (Ctrl + C, O), relancez `npm install`, puis `npm run dev`. |
