# 🔥 MISE À JOUR DES RÈGLES FIRESTORE

## ❌ PROBLÈME IDENTIFIÉ
L'erreur "Missing or insufficient permissions" indique que les règles Firestore ne permettent pas l'accès aux collections `ncnda` et `psa`.

## ✅ SOLUTION APPLIQUÉE
Les règles Firestore ont été mises à jour pour inclure la collection `psa`.

## 🚀 DÉPLOIEMENT DES RÈGLES

### Option 1: Via Firebase Console (Recommandé)
1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet SenHarvest
3. Dans le menu de gauche, cliquez sur **Firestore Database**
4. Allez dans l'onglet **Règles**
5. Remplacez le contenu par les règles suivantes :

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

6. Cliquez sur **Publier**

### Option 2: Via Firebase CLI (si installé)
```bash
firebase deploy --only firestore:rules
```

## 🔍 VÉRIFICATION
Après déploiement :
1. Rechargez la page admin (`/admin/ncnda` et `/admin/psa`)
2. L'erreur "Missing or insufficient permissions" devrait disparaître
3. Vous devriez pouvoir voir les listes vides (normal si aucun document n'existe encore)

## 📋 COLLECTIONS AUTORISÉES POUR LES ADMINS
- ✅ `ncnda` - Documents NCNDA
- ✅ `psa` - Contrats de partenariat (Profit-Sharing Agreements)
- ✅ `docs` - Proformas et devis
- ✅ `contacts` - Demandes de contact
- ✅ `product_specs` - Spécifications produits
- ✅ `settings` - Paramètres du site

## 🛡️ SÉCURITÉ
- Seuls les utilisateurs avec le custom claim `admin: true` peuvent accéder à ces collections
- Les contacts peuvent être créés par n'importe qui (formulaire public)
- Les spécifications produits sont lisibles par tous (vitrine publique)
