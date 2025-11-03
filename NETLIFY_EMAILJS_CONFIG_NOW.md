# ⚠️ ACTION URGENTE : Configurer Netlify

## 🎯 Objectif
Le site est déployé mais EmailJS ne fonctionnera PAS en production tant que les variables ne sont pas configurées dans Netlify.

---

## 📋 Étapes Importantes

### 1. Aller sur Netlify
👉 https://app.netlify.com/projects/senharvest/configuration/env

### 2. Ajouter les 3 Variables

Cliquez sur **"Add a variable"** et ajoutez :

#### Variable 1 :
**Name:** `REACT_APP_EMAILJS_SERVICE_ID`  
**Value:** `service_ykhg5ox`

#### Variable 2 :
**Name:** `REACT_APP_EMAILJS_TEMPLATE_ID`  
**Value:** `template_1sh586m`

#### Variable 3 :
**Name:** `REACT_APP_EMAILJS_PUBLIC_KEY`  
**Value:** `oa2dvrH8lCJf974vD`

### 3. Save
Cliquez sur **"Save"**

### 4. Redéployer
1. Aller dans **Deploys**
2. Cliquer sur **"Trigger deploy"**
3. Cliquer sur **"Deploy site"**
4. Attendre que le déploiement se termine

### 5. Tester
1. Aller sur https://www.senharvest.com/contact
2. Remplir le formulaire
3. Envoyer
4. Vérifier manager@senharvest.com

---

## ❌ Sans cette configuration

Le formulaire de contact affichera :
- ❌ Erreur 412 ou erreur d'envoi
- ❌ Aucun email envoyé
- ❌ Fallback localStorage uniquement

## ✅ Avec cette configuration

Le formulaire de contact fonctionnera :
- ✅ Emails envoyés via EmailJS
- ✅ Arrivée dans manager@senharvest.com
- ✅ Fallback si problème

---

## 🎉 Une fois configuré

Le site sera **100% fonctionnel** avec :
- ✅ Authentification admin
- ✅ Générateurs PDF
- ✅ Gestion produits
- ✅ **Formulaire de contact opérationnel**

🚀 **C'EST LA DERNIÈRE ÉTAPE !**

