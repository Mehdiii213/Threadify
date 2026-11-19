# Brancher l'adresse threadify.fr (étape 8b, partie 2) — guide pour débutant

Durée : environ 45 minutes de manipulations, puis jusqu'à quelques heures d'attente (le temps qu'Internet « apprenne » la nouvelle adresse). Coût : **le prix du domaine, environ 7 à 12 € par an**. Rien d'autre.

À la fin :
- le site s'ouvre sur **`https://threadify.fr`** (avec le cadenas) ;
- les e-mails partent depuis une adresse **`@threadify.fr`** vers **tous** vos clients (aujourd'hui, Resend n'envoie qu'à votre propre adresse).

On procède en 4 parties. **Faites-les dans l'ordre et prévenez-moi à la fin de chacune.**

---

## Partie A — Acheter le domaine `threadify.fr`

Un « nom de domaine », c'est l'adresse du site. On l'achète pour un an chez un « bureau d'enregistrement ». Je recommande **OVHcloud** (entreprise française, interface en français, prix bas pour les `.fr`).

1. Allez sur **https://www.ovhcloud.com/fr/domains/**.
2. Dans la case de recherche, tapez `threadify.fr` puis cliquez sur **« Rechercher »**.
   - ✅ Si c'est **disponible**, un prix s'affiche (souvent quelques euros la 1re année) : cliquez sur **« Ajouter au panier »** (ou équivalent).
   - ❌ S'il est **déjà pris**, ne choisissez rien : dites-le-moi, on choisira un autre nom ensemble (par exemple `threadify.app`, `getthreadify.fr`, `threadify-ia.fr`…).
3. **Refusez toutes les options proposées** : hébergement web, e-mail pro, « DNS Anycast », site clé en main… Nous n'en avons pas besoin (Netlify héberge déjà le site, Resend envoie les e-mails). Seul le **nom de domaine** est utile.
4. Créez votre compte OVHcloud (ou connectez-vous), remplissez vos coordonnées. Pour un `.fr`, il faut une adresse en France ou dans l'Union européenne : c'est votre cas.
5. Payez. Prenez **1 an** ; vous pourrez activer le renouvellement automatique pour ne jamais perdre l'adresse.
6. ✅ Vous recevez un e-mail de confirmation d'OVHcloud. Dans votre **espace client OVHcloud**, rubrique **« Noms de domaine »**, `threadify.fr` apparaît (l'activation peut prendre quelques minutes).

> 💡 Si vous préférez un autre bureau d'enregistrement (Gandi, IONOS, Hostinger…), c'est possible : le principe est identique. Dites-le-moi pour que j'adapte la partie B.

**Prévenez-moi quand `threadify.fr` apparaît dans votre espace OVHcloud.**

---

## Partie B — Relier `threadify.fr` à Netlify

On confie la gestion de l'adresse à Netlify (gratuit) : il s'occupe ensuite tout seul du cadenas HTTPS.

1. **Netlify** → votre projet **threadify-fr** → **« Gérer »** → **« Name and address »** → bouton **« Add a domain »**.
2. Tapez `threadify.fr` → validez. Netlify vérifie que vous en êtes propriétaire et propose d'utiliser **« Netlify DNS »** : acceptez (**« Set up Netlify DNS »** / « Add domain »), en gardant les réglages proposés.
3. ✅ Netlify affiche **4 adresses de « serveurs de noms »** (« name servers »), du genre `dns1.p01.nsone.net`, `dns2.p01.nsone.net`, … **Laissez cette page ouverte** ou recopiez-les dans un Bloc-notes.
4. **OVHcloud** → espace client → **« Noms de domaine »** → `threadify.fr` → onglet **« Serveurs DNS »** → **« Modifier les serveurs DNS »**.
5. Remplacez les serveurs d'OVHcloud par **les 4 adresses de Netlify** (une par ligne ; ajoutez des lignes si besoin), puis **« Appliquer la configuration »**.
6. ⏳ **Attente** : de 15 minutes à 24 heures (souvent moins d'une heure). Netlify affiche un message du type « Waiting on DNS propagation », puis, une fois prêt, crée automatiquement le **certificat HTTPS** (« Let's Encrypt »).
7. ✅ C'est prêt quand **`https://threadify.fr`** affiche votre site **avec le cadenas**.

> Pendant l'attente, l'ancienne adresse `https://threadify-fr.netlify.app` continue de fonctionner normalement. Vous pouvez faire la partie C en parallèle.

---

## Partie C — Autoriser Resend à envoyer depuis `@threadify.fr`

1. **https://resend.com** → menu **« Domains »** → **« Add Domain »**.
2. Domain : `threadify.fr`. Region : choisissez **Ireland (eu-west-1)** si on vous le demande → **Add**.
3. ✅ Resend affiche une liste de **3 ou 4 « enregistrements DNS »** à créer (type `MX`, `TXT`… avec un « Name » et une « Value »). **Laissez cette page ouverte.**
4. Dans un autre onglet : **Netlify** → menu du haut **« Domaines »** (« Domains ») → `threadify.fr` → **« DNS settings »** / « Add new record ».
5. Pour **chaque ligne** de Resend, cliquez sur **« Add new record »** dans Netlify et recopiez **exactement** :
   - **Record type** = le « Type » de Resend (`MX` ou `TXT`) ;
   - **Name** = le « Name » de Resend (par exemple `send` ou `resend._domainkey`) — sans ajouter `.threadify.fr` si Netlify l'ajoute déjà tout seul ;
   - **Value** = la « Value » de Resend (copiez-la avec le bouton de copie, elle est longue) ;
   - **Priority** (pour le `MX` seulement) = la valeur indiquée par Resend (souvent `10`).
6. De retour sur Resend, cliquez sur **« Verify DNS Records »**. ⏳ Quelques minutes à quelques heures.
7. ✅ Le domaine passe en **« Verified »** (vert).

---

## Partie D — Dire au site sa nouvelle adresse

**Seulement quand `https://threadify.fr` s'ouvre avec le cadenas (partie B) et que Resend affiche « Verified » (partie C).**

1. **Netlify** → **« Gérer »** → « Find a setting » : `environment` → **Environment variables**.
2. Clé **`BETTER_AUTH_URL`** → **Edit** → case **« Live app »** (et « Versions ») : `https://threadify.fr` → **Save**.
3. **« Add a variable »** (ajouter une clé) : nom **`EMAIL_FROM`**, valeur (cases « Live app » et « Versions ») :
   ```
   Threadify <noreply@threadify.fr>
   ```
   → **Save**.
4. **Deploys** → **Trigger deploy** → **Deploy project**. Attendez « live » (3 à 6 minutes).

### Vérifications finales
1. Ouvrez **`https://threadify.fr`** : ✅ le site, avec le cadenas.
2. Créez un compte de test avec **une autre adresse e-mail réelle** que la vôtre (celle d'un proche, ou une seconde adresse) : ✅ l'e-mail de confirmation arrive, expédié par **Threadify `<noreply@threadify.fr>`**.
3. Testez « Mot de passe oublié » : ✅ l'e-mail arrive aussi.

🎉 Threadify est alors prêt à accueillir de vrais visiteurs (paiements encore en mode test jusqu'à l'étape 8c).

## En cas de souci

| Ce que vous voyez | Que faire |
|---|---|
| `threadify.fr` est déjà pris | Dites-le-moi : on choisit un autre nom ; le reste du guide est identique. |
| Netlify affiche toujours « Waiting on DNS propagation » après 24 h | Vérifiez chez OVHcloud que les 4 serveurs DNS de Netlify sont bien enregistrés, sans faute de frappe. Envoyez-moi une capture. |
| Resend reste « Pending » / « Failed » | Envoyez-moi une capture des lignes Resend **et** des enregistrements créés dans Netlify : souvent un « Name » avec `.threadify.fr` en double. |
| Connexion impossible sur `https://threadify.fr` | `BETTER_AUTH_URL` doit valoir exactement `https://threadify.fr` dans la case **« Live app »**, puis il faut relancer un déploiement. |
