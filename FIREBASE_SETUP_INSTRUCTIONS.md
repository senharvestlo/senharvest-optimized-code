# 🔥 Instructions de Configuration Firebase pour SenHarvest

## 🎯 **Objectif**
Restaurer l'authentification admin Firebase pour votre site SenHarvest.

## 📋 **Étapes de Configuration**

### **1. Créer un Projet Firebase**

1. **Allez sur** [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. **Cliquez** "Ajouter un projet"
3. **Nom du projet** : `xidma-harvest`
4. **Désactivez** Google Analytics (optionnel)
5. **Cliquez** "Créer un projet"

### **2. Activer Authentication**

1. Dans votre projet Firebase, allez dans **"Authentication"**
2. Cliquez **"Commencer"**
3. Allez dans l'onglet **"Sign-in method"**
4. **Activez** :
   - ✅ **Email/Password**
   - ✅ **Google** (optionnel)

### **3. Activer Firestore Database**

1. Allez dans **"Firestore Database"**
2. Cliquez **"Créer une base de données"**
3. Choisissez **"Mode test"** (pour commencer)
4. **Région** : `us-central1`
5. Cliquez **"Terminer"**

### **4. Configurer les Règles Firestore**

Dans l'onglet **"Règles"**, remplacez par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre la lecture publique et l'écriture admin
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### **5. Obtenir les Clés Firebase**

1. Allez dans **"Paramètres du projet"** (icône ⚙️)
2. Allez dans l'onglet **"Général"**
3. Dans la section **"Vos applications"**, cliquez **"Ajouter une application"**
4. Choisissez **"Web"** (icône `</>`)
5. **Nom de l'app** : `senharvest-web`
6. **Cochez** "Configurer également Firebase Hosting" (optionnel)
7. Cliquez **"Enregistrer l'application"**

### **6. Copier les Clés de Configuration**

Vous verrez quelque chose comme :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "xidma-harvest.firebaseapp.com",
  projectId: "xidma-harvest",
  storageBucket: "xidma-harvest.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

### **7. Mettre à jour le fichier .env**

Remplacez le contenu de `.env` par :

```bash
# Firebase Configuration (REMPLACEZ par vos vraies clés)
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=xidma-harvest.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=xidma-harvest
REACT_APP_FIREBASE_STORAGE_BUCKET=xidma-harvest.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789

# Company Contact Information
REACT_APP_PHONE_SN=+221776340064
REACT_APP_PHONE_CA=+18193198464
REACT_APP_EMAIL=manager@senharvest.com
REACT_APP_WHATSAPP=+221776340064

# Cloud Function URL for Contact Form
REACT_APP_CF_SENDCONTACT_URL=https://us-central1-xidma-harvest.cloudfunctions.net/sendContact

# Optional: Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=
REACT_APP_FACEBOOK_PIXEL_ID=
```

### **8. Redémarrer le Serveur**

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm start
```

### **9. Tester l'Authentification**

1. **Allez sur** http://localhost:3000
2. **Cliquez 3 fois sur le logo** pour accéder à l'admin
3. **Testez la connexion** avec :
   - Email : `admin@senharvest.com`
   - Mot de passe : (celui que vous avez créé)

## 🎉 **Résultat Attendu**

- ✅ **Authentification admin fonctionnelle**
- ✅ **Accès au panel d'administration**
- ✅ **Gestion des spécifications produits**
- ✅ **Gestion des demandes de contact**

## 🆘 **En cas de Problème**

### **Erreur "Firebase not configured"**
- Vérifiez que le fichier `.env` contient les bonnes clés
- Redémarrez le serveur après modification du `.env`

### **Erreur "Permission denied"**
- Vérifiez les règles Firestore
- Assurez-vous d'être connecté en tant qu'admin

### **Erreur "User not found"**
- Créez un utilisateur admin dans Firebase Authentication
- Allez dans Authentication > Users > Add user

## 📝 **Mode Développement vs Production**

- **Mode développement** : Utilise les clés locales dans `.env`
- **Mode production** : Utilise les variables d'environnement Netlify

## 🔒 **Sécurité**

- ⚠️ **Ne jamais commiter** le fichier `.env` avec les vraies clés
- ✅ **Utiliser** `.env.example` pour les valeurs d'exemple
- ✅ **Configurer** les vraies clés dans Netlify pour la production

---

**🎯 Une fois configuré, vous aurez accès à toutes les fonctionnalités admin !**

