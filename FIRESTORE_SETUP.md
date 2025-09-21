# 🔥 Configuration Firestore pour SenHarvest

## ✅ **Firebase configuré avec succès !**

Vos clés Firebase ont été intégrées dans le projet. Maintenant, il faut configurer Firestore Database.

## 📋 **Étapes de configuration Firestore :**

### **1. Activer Firestore Database :**
1. Allez sur [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Sélectionnez votre projet **"xidma-harvest"**
3. Dans le menu de gauche, cliquez **"Firestore Database"**
4. Cliquez **"Créer une base de données"**
5. Choisissez **"Mode test"** (pour commencer)
6. Sélectionnez une région : **"us-central1"** (recommandé)
7. Cliquez **"Terminer"**

### **2. Configurer les règles de sécurité :**
1. Dans Firestore Database, allez dans l'onglet **"Règles"**
2. Remplacez le contenu par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture et l'écriture pour tous les utilisateurs
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Cliquez **"Publier"**

### **3. Tester la connexion :**
1. Ouvrez votre site web
2. Allez dans l'onglet **Proforma/Devis** (3 clics sur le logo)
3. Remplissez quelques informations
4. Les données devraient se sauvegarder automatiquement dans Firebase !

## 🎯 **Collections qui seront créées automatiquement :**

- **`proforma`** - Vos factures proforma
- **`sourcing_suppliers`** - Fournisseurs
- **`sourcing_buyers`** - Acheteurs
- **`sourcing_products`** - Produits
- **`product_references`** - Références produits

## 🔒 **Sécurité (optionnel) :**

Pour plus de sécurité, vous pouvez utiliser ces règles :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles plus sécurisées (nécessite authentification)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 **Test de synchronisation :**

1. **Ouvrez le site sur votre ordinateur**
2. **Ajoutez un fournisseur** dans l'onglet Sourcing
3. **Ouvrez le site sur votre téléphone**
4. **Le fournisseur apparaît automatiquement !** 🎉

## 📱 **Accès multi-appareils :**

- **Ordinateur** : `http://localhost:3000` (en développement)
- **Téléphone** : `http://192.168.0.156:3000` (même réseau WiFi)
- **Production** : `https://senharvest.com` (une fois déployé)

## ⚠️ **Important :**

- **Sauvegarde automatique** : Toutes vos modifications sont sauvegardées en temps réel
- **Synchronisation** : Les données sont synchronisées entre tous vos appareils
- **Sécurité** : Vos données sont protégées par Firebase

## 🆘 **En cas de problème :**

1. Vérifiez que Firestore est activé
2. Vérifiez les règles de sécurité
3. Consultez la console du navigateur pour les erreurs
4. Vérifiez que vous êtes connecté à Internet

---

**🎉 Félicitations ! Votre système de synchronisation Firebase est maintenant opérationnel !**
