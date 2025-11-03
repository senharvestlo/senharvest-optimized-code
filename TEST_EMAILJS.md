# 🧪 Test EmailJS Configuration

## ✅ Configuration Effectuée

**Service ID:** `service_ykhg5ox`  
**Template ID:** `template_1sh586m`  
**Public Key:** `oa2dvrH8lCJf974vD`

---

## 🎯 Pour Tester

### 1. Redémarrer le serveur de développement
```bash
# Arrêter le serveur (Ctrl+C)
npm start
```

### 2. Aller sur http://localhost:3000/contact

### 3. Remplir le formulaire et cliquer sur "Envoyer"

### 4. Vérifier dans la console
- Ouvrir DevTools (F12)
- Onglet Console
- Chercher les logs : "📧 Envoi de la demande de contact..." et "✅ Email envoyé avec succès"

### 5. Vérifier votre boîte mail
- Aller sur **manager@senharvest.com**
- Vous devriez recevoir l'email !

---

## 🔍 Si ça ne marche pas

### Vérifier les variables d'environnement
Ouvrir la console et taper :
```javascript
console.log({
  SERVICE: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  TEMPLATE: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: process.env.REACT_APP_EMAILJS_PUBLIC_KEY
});
```

### Erreurs possibles
1. **"Invalid public key"** → Vérifier la Public Key
2. **"Service ID not found"** → Vérifier le Service ID
3. **"Template ID not found"** → Vérifier le Template ID
4. **"CORS error"** → EmailJS gère ça automatiquement, peu probable

---

## 🚀 Production (Netlify)

### 1. Ajouter les variables dans Netlify
1. Aller sur https://app.netlify.com/
2. Sélectionner le site
3. **Site settings** → **Environment variables**
4. Ajouter :
   - `REACT_APP_EMAILJS_SERVICE_ID` = `service_ykhg5ox`
   - `REACT_APP_EMAILJS_TEMPLATE_ID` = `template_1sh586m`
   - `REACT_APP_EMAILJS_PUBLIC_KEY` = `oa2dvrH8lCJf974vD`
5. **Save**

### 2. Redéployer
```bash
npm run deploy
```

### 3. Tester sur www.senharvest.com

---

## ✅ Résultat Attendu

Envoi réussi avec un email reçu à **manager@senharvest.com** contenant toutes les informations du formulaire !

