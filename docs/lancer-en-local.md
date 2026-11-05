# Lancer Threadify sur son ordinateur (avec Supabase)

Guide pas à pas pour voir le site sur `localhost:3000`. Compter 20 à 30 minutes la première fois, puis 30 secondes pour relancer.

Il faut trois choses : **le code** (GitHub), **Node.js** (le moteur qui fait tourner le site) et **une base de données** (Supabase). On utilise uniquement la base de données de Supabase : les comptes utilisateurs sont gérés par Better Auth, pas par Supabase Auth.

---

## 1. Installer Node.js (une seule fois)

1. Aller sur https://nodejs.org et télécharger la version **LTS**.
2. Ouvrir le fichier téléchargé :
   - **Windows** (`.msi`) : Next à chaque écran, cocher « I accept », Install, Finish.
   - **Mac** (`.pkg`) : Continuer, Installer (mot de passe de session demandé).
3. Redémarrer l'ordinateur.

## 2. Télécharger le code

1. Aller sur https://github.com/Mehdiii213/Threadify (se connecter si besoin).
2. Bouton vert **« <> Code »** → **« Download ZIP »**.
3. Décompresser : Windows → clic droit, « Extraire tout… » ; Mac → double-clic.
4. Ranger le dossier `Threadify-main` dans **Documents**.

Vérification : le dossier contient `package.json`, `README.md`, `src`, `prisma`… (si on voit un autre `Threadify-main` dedans, utiliser celui de l'intérieur).

## 3. Préparer la base Supabase

### 3.1 Créer un projet dédié
1. https://supabase.com/dashboard → **New project**.
2. **Project name** : `threadify`.
3. **Database Password** : uniquement lettres et chiffres (pas de `@ # / ? %` ni d'espace). **Le noter.**
4. **Region** : Paris / West EU → **Create new project**, attendre 1 à 2 minutes.

### 3.2 Récupérer l'adresse de connexion
1. Bouton **Connect** en haut du projet → onglet **Connection String** → type **URI**.
2. Copier l'adresse de la section **Session pooler** (la « Direct connection » exige l'IPv6 et échoue sur beaucoup de box) :
   ```
   postgresql://postgres.abcdefghijkl:[YOUR-PASSWORD]@aws-0-eu-west-3.pooler.supabase.com:5432/postgres
   ```
3. Remplacer `[YOUR-PASSWORD]` **crochets compris** par le mot de passe.

Mot de passe oublié : Project Settings → Database → **Reset database password**.

## 4. Ouvrir un terminal dans le dossier

- **Windows** : ouvrir le dossier `Threadify-main`, cliquer dans la barre d'adresse, taper `cmd`, Entrée. (Utiliser `cmd`, pas PowerShell, qui bloque parfois `npm`.)
- **Mac** : ouvrir **Terminal**, taper `cd ` (avec un espace), glisser le dossier dans la fenêtre, Entrée.

## 5. Vérifier Node.js

```bash
node -v
```
Un numéro (ex. `v22.12.0`) doit s'afficher. Sinon : refaire l'étape 1, redémarrer, rouvrir le terminal.

## 6. Créer le fichier `.env`

Windows :
```bash
copy .env.example .env
```
```bash
notepad .env
```

Mac :
```bash
cp .env.example .env
```
```bash
open -e .env
```

Remplacer **seulement ce qui est entre guillemets** sur la ligne `DATABASE_URL`, en gardant les guillemets :
```
DATABASE_URL="postgresql://postgres.abcdefghijkl:MotDePasse123@aws-0-eu-west-3.pooler.supabase.com:5432/postgres"
```
Enregistrer et fermer. Ce fichier contient un mot de passe : ne jamais le partager (il est ignoré par Git).

## 7. Installer les composants (une fois, puis après chaque mise à jour)

```bash
npm install
```
1 à 3 minutes. Les messages `warn` / `vulnerabilities` sont sans gravité ; seules des lignes `ERR!` en rouge indiquent un problème.

## 8. Lancer le site

```bash
npm run dev
```
Attendre `Local: http://localhost:3000` et `Ready`. Sur Windows, autoriser Node.js si le pare-feu le demande. **Ne pas fermer le terminal.**

## 9. Ouvrir la page

Taper `localhost:3000` dans le navigateur. En haut à droite :
- pastille verte « Base de données : connectée » → tout fonctionne ;
- pastille rouge « injoignable » → voir le dépannage.

## Arrêter / relancer

- Arrêter : `Ctrl + C` dans le terminal (Windows : répondre `O` si demandé).
- Relancer un autre jour : étape 4, puis `npm run dev`, puis `localhost:3000`.

## Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `'node' n'est pas reconnu` / `command not found: node` | Node.js absent ou terminal ouvert avant l'installation | Refaire l'étape 1, redémarrer |
| `npm ERR! enoent … package.json` | Terminal pas dans le bon dossier | Refaire l'étape 4 |
| Pastille rouge | Adresse ou mot de passe incorrect dans `.env` | Crochets retirés ? bon mot de passe ? guillemets ? adresse « Session pooler » ? Puis `Ctrl + C` et `npm run dev` |
| Pastille rouge alors que tout semble juste | Projet Supabase gratuit **en pause** (après ~1 semaine d'inactivité) | Dashboard Supabase → **Restore project** |
| `Port 3000 is in use` | Site déjà lancé ailleurs | Fermer l'autre terminal ou ouvrir l'adresse indiquée (ex. `localhost:3001`) |
| Page « inaccessible » | `npm run dev` pas lancé ou terminal fermé | Refaire l'étape 8 |
| Fichier `.env.txt` sur Windows | Le Bloc-notes a ajouté `.txt` | Utiliser la commande `copy` de l'étape 6 |

## Récupérer une nouvelle version

Retélécharger le ZIP (étape 2), recopier son fichier `.env` dans le nouveau dossier, puis `npm install`. À partir de l'étape 1 (comptes), une commande supplémentaire créera les tables dans Supabase : elle sera ajoutée ici.
