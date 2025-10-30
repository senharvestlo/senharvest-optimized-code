# 🔑 Guide : Comment obtenir un Personal Access Token GitHub

## 📝 Étapes détaillées :

### 1. Allez sur GitHub
Ouvrez votre navigateur et allez sur : https://github.com

### 2. Connectez-vous à votre compte
Login avec vos identifiants GitHub (si pas déjà connecté)

### 3. Accédez aux paramètres de tokens
Cliquez sur votre photo de profil (en haut à droite) → **Settings**

OU allez directement : https://github.com/settings/tokens

### 4. Créez un nouveau token
- Cliquez sur **"Developer settings"** (en bas de la page dans la barre latérale gauche)
- Cliquez sur **"Personal access tokens"** → **"Tokens (classic)"**
- Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**

### 5. Configurez le token
- **Note** : Donnez un nom (ex: "Senharvest Website Deploy")
- **Expiration** : Choisissez une durée (ex: 90 days ou No expiration)
- **Scopes (permissions)** : Cochez **`repo`** (contrôle complet des dépôts privés)
  - Cela inclut : repo:status, repo_deployment, public_repo, repo:invite, security_events
- **Scrollez en bas** et cliquez sur **"Generate token"** (bouton vert)

### 6. Copiez le token immédiatement ⚠️
**IMPORTANT** : GitHub vous affichera le token UNE SEULE FOIS.
Copiez-le tout de suite et gardez-le en sécurité.

Le token ressemblera à : `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 7. Utilisez le token
Collez le token quand GitHub vous le demandera lors du push.

---

## 🔐 Utilisation du token

Lors de l'exécution de `git push`, GitHub vous demandera :
- **Username** : `senharvestlo` (votre nom d'utilisateur GitHub)
- **Password** : Collez le token (pas votre mot de passe GitHub !)

---

## ⚠️ Sécurité
- Ne partagez JAMAIS votre token
- Ne commitez JAMAIS le token dans votre code
- Si le token est compromis, supprimez-le immédiatement

## 🗑️ Pour supprimer un token plus tard
GitHub Settings → Developer settings → Personal access tokens → Supprimez le token

