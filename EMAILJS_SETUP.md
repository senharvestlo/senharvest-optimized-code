# 📧 Configuration EmailJS pour le Formulaire de Contact

## 🎯 Objectif
Configurer EmailJS pour que tous les formulaires de contact soient envoyés à **manager@senharvest.com**

---

## 📋 Étapes de Configuration

### 1️⃣ Créer un compte EmailJS
1. Allez sur https://www.emailjs.com/
2. Créez un compte gratuit (jusqu'à 200 emails/mois)
3. Connectez-vous

### 2️⃣ Ajouter un Service Email
1. Dans le dashboard, allez dans **"Email Services"**
2. Cliquez sur **"Add New Service"**
3. Choisissez votre provider email (Gmail, Outlook, SendGrid, etc.)
   - **Recommandation** : Utilisez votre service SMTP Hostinger existant
4. Suivez les instructions pour connecter votre compte
5. Notez le **Service ID** (ex: `service_xxxxx`)

### 3️⃣ Créer un Template Email
1. Allez dans **"Email Templates"**
2. Cliquez sur **"Create New Template"**
3. Configurez le template avec :

**De (From):**
```
{{from_name}} <{{from_email}}>
```

**À (To):**
```
manager@senharvest.com
```

**Sujet (Subject):**
```
[SenHarvest] {{subject}}
```

**Contenu (Content):**
```html
<h2>Nouvelle demande de contact – SenHarvest.com</h2>

<h3>INFORMATIONS CLIENT</h3>
<p><strong>Nom:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Téléphone:</strong> {{phone}}</p>

<h3>DÉTAILS DE LA DEMANDE</h3>
<p><strong>Sujet:</strong> {{subject}}</p>
<p><strong>Quantité:</strong> {{quantity}}</p>
<p><strong>Destination:</strong> {{destination}}</p>
<p><strong>Incoterm:</p> {{incoterm}}</p>
<p><strong>Mode de paiement:</strong> {{payment}}</p>

<h3>MESSAGE</h3>
<p>{{message}}</p>

<hr/>
<p style="color: #666; font-size: 12px;">
  Email envoyé depuis le site web SenHarvest Group<br/>
  Date: {{date}}
</p>
```

4. Notez le **Template ID** (ex: `template_xxxxx`)
5. Cliquez sur **"Save"**

### 4️⃣ Obtenir la Clé Publique
1. Allez dans **"Account"** → **"General"**
2. Trouvez **"Public Key"**
3. Copiez la clé (ex: `AbCdEfGhIjKlMnOpQrStUvWxYz`)

### 5️⃣ Configurer les Variables d'Environnement

#### Pour le développement local :
Créez un fichier `.env` à la racine du projet :

```bash
# EmailJS Configuration
REACT_APP_EMAILJS_SERVICE_ID=service_xxxxx
REACT_APP_EMAILJS_TEMPLATE_ID=template_xxxxx
REACT_APP_EMAILJS_PUBLIC_KEY=AbCdEfGhIjKlMnOpQrStUvWxYz
```

#### Pour Netlify (production) :
1. Allez sur https://app.netlify.com/
2. Sélectionnez votre site **"senharvest"**
3. Allez dans **"Site settings"** → **"Environment variables"**
4. Ajoutez les 3 variables :
   - `REACT_APP_EMAILJS_SERVICE_ID` = votre Service ID
   - `REACT_APP_EMAILJS_TEMPLATE_ID` = votre Template ID
   - `REACT_APP_EMAILJS_PUBLIC_KEY` = votre Public Key
5. Cliquez sur **"Save"**
6. Redéployez le site

---

## ✅ Test

### 1️⃣ Localement
1. Redémarrez le serveur de développement : `npm start`
2. Remplissez le formulaire de contact sur http://localhost:3000
3. Soumettez le formulaire
4. Vérifiez que vous recevez l'email à **manager@senharvest.com**

### 2️⃣ En Production
1. Allez sur https://www.senharvest.com
2. Remplissez le formulaire de contact
3. Soumettez le formulaire
4. Vérifiez votre boîte mail

---

## 🔧 Dépannage

### L'email n'est pas envoyé
1. Ouvrez la console du navigateur (F12)
2. Vérifiez s'il y a des erreurs
3. Vérifiez que les variables d'environnement sont correctes
4. Vérifiez que le Service ID, Template ID et Public Key sont valides

### Email reçu mais vide
1. Vérifiez le template dans EmailJS
2. Assurez-vous que les variables `{{from_name}}`, `{{message}}`, etc. sont correctement écrites

### Erreur CORS
EmailJS gère automatiquement CORS, cette erreur ne devrait pas apparaître.

---

## 📊 Plan Gratuit EmailJS
- ✅ 200 emails/mois
- ✅ Support Gmail, Outlook, SendGrid, etc.
- ✅ Templates personnalisables
- ✅ Logs d'envoi

**Si vous dépassez 200 emails/mois**, les options payantes commencent à $15/mois pour 1,000 emails.

---

## 📝 Fichiers Modifiés
- ✅ `src/services/contacts.js` - Intégration EmailJS
- ✅ `env.example` - Variables d'environnement ajoutées
- ✅ EmailJS déjà installé dans `package.json`

---

## 🚀 Résultat
Une fois configuré, tous les formulaires de contact seront automatiquement envoyés à **manager@senharvest.com** sans backend ni Firebase !

