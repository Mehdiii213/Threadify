# Mettre Threadify en ligne (étape 8b, partie 1) — guide pour débutant, Windows

Durée : environ 45 minutes. **Coût : 0 €.** À la fin, Threadify sera en ligne à une adresse gratuite du type **`https://threadify.netlify.app`**, ouvrable depuis n'importe quel ordinateur ou téléphone. Le nom de domaine `threadify.fr` sera ajouté dans la partie 2.

Les paiements restent en **mode test** (carte `4242…`) : personne ne peut encore payer pour de vrai. Les vrais paiements seront activés à l'étape 8c.

> Rappel sur la **fenêtre noire** : on tape une commande, on appuie sur **Entrée**, et c'est terminé quand la ligne `C:\2222\Threadify-main>` réapparaît. Si le titre commence par « Sélection », appuyez sur **Échap**.

## Avant de commencer : un fichier pour noter vos secrets

Vous allez récupérer plusieurs clés secrètes. Notez-les au fur et à mesure dans **un seul fichier**, rangé **hors** du dossier du projet :

1. Ouvrez le **Bloc-notes** (touche Windows, tapez `bloc-notes`, **Entrée**).
2. Collez-y ce modèle (vous le compléterez au fil du guide) :
   ```
   DATABASE_URL="à compléter (étape A)"
   BETTER_AUTH_SECRET="à compléter (étape B)"
   BETTER_AUTH_URL="https://threadify.netlify.app"
   ANTHROPIC_API_KEY="à compléter (étape C)"
   ADMIN_EMAILS="votre-adresse@exemple.fr"
   RESEND_API_KEY="à compléter (étape D)"
   STRIPE_SECRET_KEY="à compléter (étape E)"
   STRIPE_PRICE_PRO="price_1UbfLUAPdDZksFFK8iDmwUo8"
   STRIPE_PRICE_EXPERT="price_1UbfLVAPdDZksFFKxxSsOcW5"
   ```
3. Sur la ligne `ADMIN_EMAILS`, remplacez `votre-adresse@exemple.fr` par **votre adresse e-mail** (celle avec laquelle vous créerez votre compte sur le site en ligne).
4. **Fichier → Enregistrer sous…** → choisissez le dossier **Documents** → nom : `threadify-production.txt` → **Enregistrer**.

> ⚠️ Ce fichier contient des secrets : ne l'envoyez à personne, ne le mettez pas dans `C:\2222\Threadify-main`, et cachez-le sur vos captures d'écran.

---

## Étape A — Créer la base de données de production (Supabase)

On crée une **nouvelle** base, séparée de celle de vos tests : vos clients ne verront pas vos comptes de test.

1. Allez sur **https://supabase.com/dashboard** et connectez-vous.
2. Cliquez sur **« New project »** (nouveau projet).
3. Remplissez :
   - **Name** (nom) : `threadify-production` ;
   - **Database Password** (mot de passe de la base) : inventez un mot de passe **avec uniquement des lettres et des chiffres** (pas de `@ # / ? %`, ils cassent l'adresse de connexion), d'au moins 16 caractères. Copiez-le tout de suite dans votre fichier `threadify-production.txt`, sur une nouvelle ligne `mot de passe base : …` ;
   - **Region** (région) : choisissez **« East US (Ohio) »**. C'est la région la plus proche des serveurs gratuits de Netlify (eux aussi dans l'Ohio) : le site sera beaucoup plus rapide. La politique de confidentialité du site l'indique déjà.
4. Cliquez sur **« Create new project »**. ✅ Une page « Setting up project » s'affiche ; attendez **1 à 2 minutes** que le projet soit prêt.
5. Cliquez sur le bouton **« Connect »** en haut de la page. Dans la fenêtre qui s'ouvre, repérez la partie **« Session pooler »** et cliquez sur l'icône de copie à côté de l'adresse (elle commence par `postgresql://postgres.` et contient `pooler.supabase.com:5432`).
6. Dans votre fichier `threadify-production.txt`, collez cette adresse entre les guillemets de la ligne `DATABASE_URL="…"`, puis remplacez **`[YOUR-PASSWORD]`** (crochets compris) par le mot de passe choisi au point 3.
7. **Ctrl + S** pour enregistrer le fichier.

## Étape B — Créer la clé secrète du site

1. Dans la fenêtre noire (dans `C:\2222\Threadify-main`), tapez :
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
2. ✅ Une ligne de lettres et chiffres au hasard s'affiche (ex. `k3J9…=`). Sélectionnez-la à la souris, appuyez sur **Entrée** pour la copier.
3. Collez-la entre les guillemets de `BETTER_AUTH_SECRET="…"` dans votre fichier. **Ctrl + S**.

> Ne réutilisez pas la clé de votre `.env` local : le site en ligne doit avoir la sienne.

## Étape C — Une clé d'IA dédiée, avec un plafond de dépenses

1. Allez sur **https://platform.claude.com** et connectez-vous.
2. Menu **Settings** (Paramètres) → **API keys** → **« Create Key »**. Nom : `threadify-production` → **Create**.
3. ✅ La clé s'affiche **une seule fois** (elle commence par `sk-ant-`) : copiez-la entre les guillemets de `ANTHROPIC_API_KEY="…"`. **Ctrl + S**.
4. **Plafond de dépenses** (très important) : dans **Settings**, ouvrez la page **« Limits »** (ou « Billing »), et réglez une **limite de dépenses mensuelle** (« Spend limit »), par exemple **20 $**. Si un problème survenait (bug, abus), l'IA s'arrêterait à ce montant au lieu de vider votre compte.

> Les menus de cette console changent de temps en temps : si vous ne trouvez pas « Limits », envoyez-moi une capture.

## Étape D — Le service d'e-mails (Resend)

1. Allez sur **https://resend.com** → **« Get started »** (ou « Sign up »).
2. Inscrivez-vous **avec la même adresse e-mail que celle de la ligne `ADMIN_EMAILS`** : tant que le nom de domaine n'est pas branché (partie 2), Resend n'envoie des e-mails **qu'à cette adresse-là**.
3. Confirmez votre adresse (Resend vous envoie un e-mail), puis connectez-vous.
4. Menu **« API Keys »** → **« Create API Key »**. Nom : `threadify-production`, permission **« Sending access »** → **Add** (ou Create).
5. ✅ La clé s'affiche une seule fois (elle commence par `re_`) : copiez-la entre les guillemets de `RESEND_API_KEY="…"`. **Ctrl + S**.

## Étape E — La clé Stripe de test

1. Dans la fenêtre noire, tapez `notepad .env` puis **Entrée**.
2. Copiez la valeur de la ligne `STRIPE_SECRET_KEY` (entre les guillemets, elle commence par `sk_test_`) et collez-la dans votre fichier, sur la ligne `STRIPE_SECRET_KEY="…"`.
3. Fermez le `.env` **sans le modifier**. Dans votre fichier `threadify-production.txt` : **Ctrl + S**.

✅ Votre fichier est maintenant complet : plus aucune ligne « à compléter ».

---

## Étape F — Mettre le site en ligne avec Netlify

1. Allez sur **https://app.netlify.com/signup** et choisissez **« Sign up with GitHub »** (s'inscrire avec GitHub). Connectez-vous avec votre compte GitHub (celui du dépôt `Mehdiii213/Threadify`) et cliquez sur **« Authorize Netlify »**.
2. Si Netlify pose des questions de bienvenue (usage, équipe), répondez au plus simple (usage personnel) et passez.
3. Cliquez sur **« Add new project »** (ou « Add new site ») → **« Import an existing project »** → **« GitHub »**.
4. Une fenêtre GitHub peut s'ouvrir pour autoriser Netlify à voir vos dépôts : choisissez **« Only select repositories »** → **Threadify** → **« Install »** (ou « Save »).
5. ✅ La liste de vos dépôts s'affiche : cliquez sur **Threadify**.
6. Page de réglages :
   - **Project name** (nom du projet) : tapez `threadify`. ✅ L'adresse du site sera `https://threadify.netlify.app`. Si Netlify dit que le nom est déjà pris, essayez `threadify-app` (ou un autre), **et notez l'adresse obtenue** : il faudra la mettre dans `BETTER_AUTH_URL` (point 7).
   - **Branch to deploy** : `main` ;
   - **Build command** et **Publish directory** : ne touchez à rien, Netlify lit les réglages fournis avec le code.
7. Cliquez sur **« Add environment variables »** (ajouter des variables d'environnement) → **« Import from a .env file »**. Ouvrez votre fichier `threadify-production.txt`, sélectionnez les **9 lignes** (de `DATABASE_URL` à `STRIPE_PRICE_EXPERT`, sans la ligne « mot de passe base »), **Ctrl + C**, puis collez-les dans la grande zone de texte de Netlify (**Ctrl + V**).
   - Si l'adresse de votre site n'est pas `https://threadify.netlify.app` (point 6), corrigez la ligne `BETTER_AUTH_URL` avant de valider.
8. Cliquez sur **« Deploy threadify »** (ou « Deploy site »).
9. ✅ Une page de suivi s'ouvre avec le **journal de construction** (des lignes de texte qui défilent, comme dans la fenêtre noire). Comptez **3 à 6 minutes**. Vous verrez notamment passer `All migrations have been successfully applied.` (la base de production se remplit de ses tables), puis la construction du site.
10. ✅ À la fin : **« Published »** / **« Site is live »** en vert, et l'adresse de votre site s'affiche en haut de la page.

> Si le journal se termine en rouge par **« Build failed »**, ne cherchez pas : faites une capture de la fin du journal (les 30 dernières lignes) et envoyez-la-moi.

---

## Étape G — Vérifier le site en ligne

1. Ouvrez **`https://threadify.netlify.app`** (ou votre adresse). ✅ La page d'accueil de Threadify, avec le **cadenas** dans la barre d'adresse (connexion sécurisée HTTPS).
2. **Créer votre compte** : « Commencer gratuitement » → inscrivez-vous **avec l'adresse de la ligne `ADMIN_EMAILS`**.
3. ✅ Le bandeau jaune « Confirmez votre adresse e-mail » s'affiche, et **cette fois, un vrai e-mail arrive dans votre boîte** (expéditeur « Threadify », regardez aussi les courriers indésirables). Cliquez sur **« Confirmer mon adresse »**. ✅ « Votre adresse e-mail est confirmée. »
4. **Une vraie génération** : « + Nouvelle création » → une idée → « Carrousel Instagram » → « Continuer » → « ✨ Générer ». ✅ Les slides apparaissent après 10 à 60 secondes. Téléchargez le ZIP : ✅ les images s'enregistrent.
5. **Paiement de test** : « Mon abonnement » → « Passer à Pro » → carte `4242 4242 4242 4242`, `12 / 34`, `123` → ✅ retour sur Threadify en offre Pro.
6. **Votre page des coûts** : `https://threadify.netlify.app/admin/couts` → ✅ votre génération avec son coût réel.
7. **Sur votre téléphone** : ouvrez la même adresse dans le navigateur du téléphone (Wi-Fi ou 4G). ✅ Le site s'affiche et vous pouvez vous connecter.

## Et ensuite ?

- **Chaque mise à jour que je pousse sur GitHub est mise en ligne automatiquement** par Netlify (environ 5 minutes) : plus besoin de télécharger le ZIP pour voir les nouveautés en ligne. (Le ZIP reste utile pour tester sur votre ordinateur.)
- **Partie 2** : brancher `threadify.fr` (achat du domaine, liaison à Netlify, e-mails envoyés depuis `@threadify.fr` à tous vos clients).
- **Étape 8c** : vrais paiements (Kbis, médiateur, Stripe en mode réel).

## En cas de souci

| Ce que vous voyez | Que faire |
|---|---|
| « Build failed » dans Netlify | Capture des dernières lignes du journal, envoyez-la-moi. |
| Erreur `ENOTFOUND tenant/user … not found` dans le journal | L'adresse `DATABASE_URL` est fausse (mot de passe pas remplacé, crochets restés, mauvaise adresse). Corrigez-la dans Netlify : **Project configuration → Environment variables**, puis **Deploys → Trigger deploy → Deploy project**. |
| Le site s'ouvre mais la connexion ou l'inscription échoue | `BETTER_AUTH_URL` ne correspond pas exactement à l'adresse du site (avec `https://`, sans `/` final). Corrigez-la comme ci-dessus, puis relancez un déploiement. |
| Pas d'e-mail de confirmation | Vérifiez les courriers indésirables, puis que vous vous êtes inscrit avec **la même adresse** que votre compte Resend. |
| « La clé de l'IA est invalide » | Vérifiez la ligne `ANTHROPIC_API_KEY` dans Netlify (clé copiée en entier ?) et qu'il reste du crédit sur platform.claude.com. |
