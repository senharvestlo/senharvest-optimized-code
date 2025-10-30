# 🚀 Configuration Rapide EmailJS

## ⚡ Résumé Express

✅ **EmailJS est déjà installé** dans le projet  
✅ **Le code est prêt** dans `src/services/contacts.js`  
⏳ **Il reste à configurer** les credentials EmailJS  

---

## 📝 Étapes Express (5 minutes)

### 1. Créer un compte EmailJS
👉 https://www.emailjs.com/ → Créer un compte gratuit

### 2. Configurer Email Service
- **Email Services** → **Add New Service**
- Connectez votre Gmail ou SMTP Hostinger
- Notez le **Service ID** : `service_xxxxx`

### 3. Créer Template
- **Email Templates** → **Create New Template**
- **To** : `manager@senharvest.com`
- **Subject** : `[SenHarvest] {{subject}}`
- **Body** : Utilisez les variables `{{from_name}}`, `{{email}}`, `{{phone}}`, `{{subject}}`, `{{message}}`, etc.
- Notez le **Template ID** : `template_xxxxx`

### 4. Obtenir Public Key
- **Account** → **General**
- Copiez la **Public Key** : `xxxxxxxxx`

### 5. Configurer dans Netlify
1. Aller sur https://app.netlify.com/
2. Votre site **senharvest**
3. **Site settings** → **Environment variables**
4. Ajouter 3 variables :
   ```
   REACT_APP_EMAILJS_SERVICE_ID = service_xxxxx
   REACT_APP_EMAILJS_TEMPLATE_ID = template_xxxxx
   REACT_APP_EMAILJS_PUBLIC_KEY = xxxxxxxxx
   ```
5. **Save** puis **Redeploy**

---

## 🎯 Résultat

Tous les formulaires de contact arrivent maintenant dans **manager@senharvest.com** ! 🎉

---

## 📧 Pour tester localement

Créez un fichier `.env` à la racine :
```bash
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=xxxxxxxxx
```

Puis `npm start` et testez le formulaire !

---

## 📚 Documentation complète

Voir `EMAILJS_SETUP.md` pour plus de détails.

