# 🔍 DIAGNOSTIC : Missing or insufficient permissions

## 🚨 PROBLÈME IDENTIFIÉ
L'erreur "Missing or insufficient permissions" persiste pour les collections NCNDA et PSA.

## 🔧 DIAGNOSTIC ÉTAPE PAR ÉTAPE

### 1. Vérifier l'authentification (Debug ajouté)
Un composant de debug a été ajouté en bas à droite de l'écran qui affiche :
- ✅ **Loading** : État du chargement
- ✅ **User** : Email de l'utilisateur connecté
- ✅ **Is Admin** : Si l'utilisateur a les droits admin
- ✅ **Claims** : Tous les custom claims Firebase
- ✅ **UID** : Identifiant unique de l'utilisateur

### 2. Actions à effectuer :

#### A. Connectez-vous en tant qu'admin
1. Allez sur le site web
2. Cliquez 3 fois sur le logo SenHarvest en bas
3. Connectez-vous avec Google ou email/password
4. **Regardez le debug en bas à droite**

#### B. Vérifiez les informations du debug
- **User** doit afficher votre email
- **Is Admin** doit afficher "Yes"
- **Claims** doit contenir `{"admin": true}`

#### C. Si "Is Admin" = "No"
Vous n'avez pas le custom claim admin. Solutions :
1. **Via Cloud Function** (si disponible) :
   - Allez sur `/admin` 
   - Cherchez un bouton "Grant Admin" ou similaire
   - Cliquez dessus

2. **Via Firebase Console** :
   - Allez sur https://console.firebase.google.com
   - Sélectionnez votre projet
   - **Authentication** → **Users**
   - Trouvez votre utilisateur
   - Cliquez sur l'icône "..." → **Edit user**
   - **Custom claims** → Ajoutez : `{"admin": true}`
   - **Save**

#### D. Si "Is Admin" = "Yes" mais erreur persiste
Le problème vient des règles Firestore.

### 3. Déployer les règles Firestore

#### Option 1: Règles permissives (TEMPORAIRE pour test)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Option 2: Règles correctes (RECOMMANDÉ)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null && request.auth.token.admin == true;
    }

    // Contacts: lecture admin uniquement, écriture publique
    match /contacts/{id} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }

    // Proformas/Devis (docs collection)
    match /docs/{id} {
      allow read: if isAdmin();
      allow create, update, delete: if isAdmin();
    }

    // NCNDA
    match /ncnda/{id} {
      allow read: if isAdmin();
      allow create, update, delete: if isAdmin();
    }

    // PSA (Profit-Sharing Agreements)
    match /psa/{id} {
      allow read: if isAdmin();
      allow create, update, delete: if isAdmin();
    }

    // Spécifications produits
    match /product_specs/{id} {
      allow read: if true;           // public: visible côté vitrine
      allow create, update, delete: if isAdmin();
    }

    // Meta, settings si besoin
    match /settings/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

### 4. Déploiement des règles

#### Via Firebase Console :
1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet SenHarvest
3. **Firestore Database** → **Règles**
4. Copiez-collez les règles (Option 1 pour test, Option 2 pour production)
5. Cliquez sur **Publier**

#### Via Firebase CLI (si installé) :
```bash
firebase deploy --only firestore:rules
```

### 5. Test final
1. Rechargez la page
2. Vérifiez que le debug montre "Is Admin: Yes"
3. Allez sur `/admin/ncnda` ou `/admin/psa`
4. L'erreur "Missing or insufficient permissions" devrait disparaître

## 🎯 RÉSULTAT ATTENDU
- ✅ Debug affiche "Is Admin: Yes"
- ✅ Pages NCNDA et PSA s'affichent sans erreur
- ✅ Listes vides (normal si aucun document)

## 🚨 SI LE PROBLÈME PERSISTE
1. Vérifiez que Firebase est bien configuré dans `.env`
2. Vérifiez que les variables d'environnement sont correctes
3. Regardez la console du navigateur pour d'autres erreurs
4. Testez avec les règles permissives (Option 1) d'abord
