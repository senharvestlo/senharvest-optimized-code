# 🔥 Configuration Firebase pour SenHarvest

## 📋 **Étapes de configuration :**

### **1. Créer un projet Firebase :**
1. Allez sur [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Cliquez "Créer un projet" ou "Add project"
3. Nom du projet : `senharvest-group` (ou votre choix)
4. Activez Google Analytics (optionnel)
5. Créez le projet

### **2. Configurer Firestore Database :**
1. Dans le menu de gauche, cliquez "Firestore Database"
2. Cliquez "Créer une base de données"
3. Choisissez "Mode test" (pour commencer)
4. Sélectionnez une région (ex: `us-central1`)
5. Créez la base de données

### **3. Configurer l'authentification :**
1. Dans le menu de gauche, cliquez "Authentication"
2. Cliquez "Commencer"
3. Allez dans l'onglet "Sign-in method"
4. Activez "Email/Password"
5. Sauvegardez

### **4. Obtenir les clés de configuration :**
1. Dans le menu de gauche, cliquez sur l'icône ⚙️ "Paramètres du projet"
2. Allez dans l'onglet "Général"
3. Faites défiler vers le bas jusqu'à "Vos applications"
4. Cliquez sur l'icône Web `</>`
5. Nom de l'app : `SenHarvest Website`
6. Activez "Firebase Hosting" (optionnel)
7. Cliquez "Enregistrer l'application"
8. **COPIEZ** les clés de configuration

### **5. Mettre à jour le fichier de configuration :**
Remplacez les valeurs dans `src/config/firebase.js` :

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY_ICI",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet-id",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "votre-app-id"
};
```

### **6. Configurer les règles de sécurité Firestore :**
Dans l'onglet "Règles" de Firestore, remplacez par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture et l'écriture pour tous les utilisateurs authentifiés
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Ou pour un accès public (moins sécurisé mais plus simple)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 🚀 **Fonctionnalités disponibles :**

### **✅ Synchronisation automatique :**
- Toutes les données sont sauvegardées en temps réel
- Accessible depuis n'importe quel appareil
- Synchronisation automatique entre tous vos appareils

### **✅ Collections Firebase :**
- `proforma` - Toutes vos factures proforma
- `sourcing_suppliers` - Fournisseurs
- `sourcing_buyers` - Acheteurs  
- `sourcing_products` - Produits
- `product_references` - Références produits

### **✅ Sauvegarde automatique :**
- Chaque modification est sauvegardée automatiquement
- Pas besoin de cliquer "Sauvegarder"
- Données toujours à jour

## 🔒 **Sécurité :**

### **Option 1 : Accès public (simple)**
```javascript
allow read, write: if true;
```

### **Option 2 : Authentification requise (recommandé)**
```javascript
allow read, write: if request.auth != null;
```

## 📱 **Test de la synchronisation :**

1. Ouvrez le site sur votre ordinateur
2. Ajoutez un fournisseur
3. Ouvrez le site sur votre téléphone
4. Le fournisseur apparaît automatiquement ! 🎉

## 💰 **Coûts :**
- **Gratuit** jusqu'à 1GB de données
- **Gratuit** jusqu'à 50,000 lectures/écritures par jour
- Plus que suffisant pour votre usage !

## 🆘 **En cas de problème :**
1. Vérifiez que les clés Firebase sont correctes
2. Vérifiez que Firestore est activé
3. Vérifiez les règles de sécurité
4. Consultez la console du navigateur pour les erreurs

---

**🎯 Une fois configuré, toutes vos données seront synchronisées automatiquement entre tous vos appareils !**
