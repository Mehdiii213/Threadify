# Activer son compte Stripe (avant le Kbis) — guide pour débutant

But : préparer le compte Stripe pour les vrais paiements. **Le site reste en mode test** tant que Claude n'a pas branché les clés réelles (étape 8c) : rien ne change pour les visiteurs.

## Avant de commencer
- Votre **IBAN** (relevé d'identité bancaire), de préférence un compte dédié à l'activité.
- Votre **pièce d'identité** (carte d'identité ou passeport), à photographier.
- Votre **numéro SIRET**, s'il est déjà attribué : il arrive souvent **avant** le Kbis (e-mail ou courrier de l'INSEE « avis de situation »). Vérifiez en tapant votre nom sur **annuaire-entreprises.data.gouv.fr**.

## Étapes
1. **dashboard.stripe.com** → connectez-vous (même compte que pour les tests).
2. En haut, un bandeau **« Activer les paiements »** (ou « Activate payments ») → cliquez dessus.
3. **Pays** : **France** ⚠️ (impossible à changer ensuite).
4. **Type d'entreprise** : **Entreprise individuelle** (micro-entreprise). ⚠️ Ne choisissez pas « Particulier » pour contourner l'absence de SIRET.
5. **Informations sur l'entreprise** : SIRET / SIREN si demandé. **Si vous ne l'avez pas encore** : arrêtez-vous ici. Stripe garde ce que vous avez rempli, et vous reprendrez dès réception du numéro.
6. **Vous-même** : nom, date de naissance, adresse, téléphone, photo de la pièce d'identité.
7. **Activité** : site web `https://threadify.fr`, description « Logiciel en ligne (abonnement) de création de carrousels et de threads par intelligence artificielle », libellé de relevé bancaire `THREADIFY`.
8. **Compte bancaire** : votre IBAN.
9. **Validation** : relisez puis envoyez. Stripe peut demander des documents en plus dans les jours suivants (e-mail).

✅ Le bandeau disparaît, ou indique « en cours de vérification ».

## À ne pas faire maintenant
- Ne pas copier les **clés réelles** (`sk_live_…`) : Claude les demandera à l'étape 8c, dans Netlify uniquement, jamais dans la discussion.
