# 🔥 Configuration Firebase

## ⚠️ IMPORTANT : Variables d'environnement manquantes

Le site utilise actuellement des valeurs de démonstration pour Firebase. Pour une utilisation en production, vous devez configurer vos vraies clés Firebase.

## 📋 Étapes de configuration

### 1. Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet avec vos vraies clés Firebase :

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_real_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Firebase Functions Region
REACT_APP_FIREBASE_REGION=us-central1

# Cloud Functions Endpoint
REACT_APP_CF_SENDCONTACT_URL=https://us-central1-your_project.cloudfunctions.net/sendContact
```

### 2. Où trouver vos clés Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Cliquez sur l'icône ⚙️ (Settings) → Project settings
4. Dans l'onglet "General", trouvez la section "Your apps"
5. Copiez les valeurs de configuration

### 3. Redémarrer le serveur

Après avoir créé le fichier `.env` :

```bash
npm start
```

## 🧪 Test de connexion

Une fois configuré, testez Firebase dans la console du navigateur :

```javascript
testFirebase()
```

## 🚨 Mode démonstration actuel

En attendant la configuration, le site fonctionne en mode démonstration avec :
- ✅ Interface utilisateur complète
- ✅ Navigation et pages
- ⚠️ Firebase en mode démonstration (pas de vraie base de données)
- ⚠️ Authentification limitée

## 📞 Support

Si vous avez besoin d'aide pour configurer Firebase, contactez votre développeur.