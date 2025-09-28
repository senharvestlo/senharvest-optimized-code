# 🧪 GUIDE DE TEST - SYSTÈME FIREBASE COMPLET

## ✅ **STATUS DÉPLOIEMENT**

### **Règles Firestore** ✅ DÉPLOYÉES
- Règles avec `ownerUid` et `admin` claims
- Collections sécurisées : proformas, quotations, ncndas, productSpecs, contacts

### **Cloud Functions** ✅ DÉPLOYÉES
- `setAdminClaim` : Attribution des rôles admin
- `submitContact` : Envoi d'emails via Hostinger

---

## 🔐 **ÉTAPES DE CONFIGURATION MANUELLE**

### **1. Activer l'Authentification Firebase**

1. **Aller sur** : https://console.firebase.google.com/project/xidma-harvest
2. **Cliquer** sur "Authentication" dans le menu gauche
3. **Cliquer** sur "Get started" si première fois
4. **Aller** dans l'onglet "Sign-in method"
5. **Activer** "Email/Password" :
   - Cliquer sur "Email/Password"
   - Activer "Email/Password" (première option)
   - Cliquer sur "Save"

### **2. Créer l'Utilisateur Admin**

1. **Dans** Authentication > Users
2. **Cliquer** sur "Add user"
3. **Email** : `manager@senharvest.com`
4. **Mot de passe** : [Choisir un mot de passe fort]
5. **Cliquer** sur "Add user"

### **3. Configurer les Variables d'Environnement (Optionnel)**

1. **Aller** dans Functions > Configuration
2. **Ajouter** les variables :
   - `EMAIL_USER` = `inquiry@senharvest.com`
   - `EMAIL_PASS` = `[mot de passe email Hostinger]`

---

## 🧪 **TESTS À EFFECTUER**

### **Test 1 : Connexion via Logo Footer**

1. **Démarrer** l'application : `npm start`
2. **Aller** en bas de page (footer)
3. **Cliquer** sur le logo SenHarvest
4. **Saisir** :
   - Email : `manager@senharvest.com`
   - Mot de passe : [votre mot de passe]
5. **Cliquer** sur "Se connecter"
6. **Vérifier** : Message "Connecté" affiché

### **Test 2 : Accès Interface Admin**

1. **Après connexion**, aller sur la page admin
2. **Vérifier** que l'interface s'affiche
3. **Aller** dans l'onglet "NCNDA"
4. **Vérifier** que le bouton "Grant Admin" est visible

### **Test 3 : Attribution Rôle Admin**

1. **Dans** l'onglet NCNDA
2. **Saisir** l'email : `manager@senharvest.com`
3. **Cliquer** sur "Grant"
4. **Vérifier** : Message de succès affiché
5. **Se déconnecter/reconnecter** pour actualiser le token

### **Test 4 : Création NCNDA**

1. **Après attribution admin**, cliquer sur "Nouveau" dans NCNDA
2. **Remplir** les informations :
   - Réf. contrat : `TEST-001`
   - Vendeur : Informations de test
   - Acheteur : Informations de test
3. **Cliquer** sur "Enregistrer"
4. **Vérifier** : NCNDA créé sans erreur de permissions

### **Test 5 : Génération PDF**

1. **Dans** l'éditeur NCNDA
2. **Cliquer** sur "📥 Télécharger PDF"
3. **Vérifier** : PDF généré sans "about:blank"
4. **Cliquer** sur "🖨️ Imprimer"
5. **Vérifier** : Fenêtre d'impression sans "about:blank"

---

## 🚨 **DÉPANNAGE**

### **Erreur "Missing or insufficient permissions"**

**Causes possibles :**
1. **Utilisateur non connecté** → Se connecter via logo footer
2. **Pas de rôle admin** → Utiliser le bouton "Grant Admin"
3. **Document sans ownerUid** → Vérifier les services Firestore

**Solutions :**
1. **Vérifier** la connexion dans la console navigateur
2. **Vérifier** les règles Firestore dans Firebase Console
3. **Vérifier** que le document a un `ownerUid`

### **Erreur "Not authenticated"**

**Causes possibles :**
1. **Firebase Auth non configuré** → Activer Email/Password
2. **Token expiré** → Se reconnecter
3. **Configuration Firebase incorrecte** → Vérifier les clés

**Solutions :**
1. **Vérifier** la configuration Firebase
2. **Vérifier** que l'utilisateur existe dans Authentication
3. **Vérifier** les logs dans la console navigateur

### **Cloud Functions ne fonctionnent pas**

**Causes possibles :**
1. **Fonctions non déployées** → Redéployer
2. **Variables d'environnement manquantes** → Configurer
3. **Permissions insuffisantes** → Vérifier les rôles

**Solutions :**
1. **Vérifier** le déploiement dans Firebase Console
2. **Vérifier** les logs des fonctions
3. **Tester** les fonctions individuellement

---

## 📊 **VÉRIFICATION FINALE**

### **✅ Checklist Complète**

- [ ] **Authentification** : Connexion via logo footer fonctionne
- [ ] **Règles Firestore** : Déployées et actives
- [ ] **Cloud Functions** : Déployées et accessibles
- [ ] **Rôle Admin** : Attribué et fonctionnel
- [ ] **Création NCNDA** : Sans erreur de permissions
- [ ] **Génération PDF** : Sans "about:blank"
- [ ] **Interface Admin** : Pleinement opérationnelle

### **🎯 Résultat Attendu**

- ✅ **Système d'authentification** complet
- ✅ **Gestion des rôles** fonctionnelle
- ✅ **Sécurité Firestore** renforcée
- ✅ **PDF generation** sans problèmes
- ✅ **Interface admin** pleinement opérationnelle

---

**Status** : 🚀 **Prêt pour tests - Système Firebase complet déployé**
