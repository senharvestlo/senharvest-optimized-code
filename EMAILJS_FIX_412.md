# 🔧 Fix Erreur 412 EmailJS

## ❌ Erreur
```
Failed to load resource: the server responded with a status of 412
❌ Erreur lors de l'envoi de l'email
```

## 🔍 Cause
L'erreur **412** signifie que le **template EmailJS n'est pas correctement configuré** ou que les variables ne correspondent pas.

## ✅ Solution

### Étape 1 : Vérifier le Template dans EmailJS

1. Aller sur https://dashboard.emailjs.com/admin
2. Cliquer sur **"Email Templates"**
3. Trouver le template **template_1sh586m**
4. Cliquer sur **"Edit"**

### Étape 2 : Configurer le Template CorRECTEMENT

#### **Fields disponibles :**
Le code envoie ces variables (voir `src/services/contacts.js:22-34`) :
```javascript
from_name       // Nom de l'utilisateur
from_email      // Email de l'utilisateur  
phone          // Téléphone
subject        // Sujet de la demande
quantity       // Quantité
destination    // Destination
incoterm       // Incoterm (FOB/CIF)
payment        // Mode de paiement
message        // Message principal
to_email       // Email de destination (manager@senharvest.com)
to_name        // Nom du destinataire
```

#### **Configuration du Template :**

**Service ID :** `service_pntmtmn`  
**Template ID :** `template_1sh586m`

**From (De) :**
```
{{from_name}} <{{from_email}}>
```

**To (À) :**
```
manager@senharvest.com
```

**Subject (Sujet) :**
```
[SenHarvest] {{subject}}
```

**Content (Contenu) :**
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
<p><strong>Incoterm:</strong> {{incoterm}}</p>
<p><strong>Mode de paiement:</strong> {{payment}}</p>

<h3>MESSAGE</h3>
<p>{{message}}</p>

<hr/>
<p style="color: #666; font-size: 12px;">
  Email envoyé depuis le site web SenHarvest Group<br/>
  Date: {{date}}
</p>
```

### Étape 3 : Tester

1. Cliquer sur **"Save"**
2. Aller sur www.senharvest.com/contact
3. Remplir et envoyer le formulaire
4. Vérifier manager@senharvest.com

---

## 🧪 Alternative : Template Simplifié

Si l'erreur persiste, essayer un template minimal :

**Content :**
```html
<p><strong>Nom:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Téléphone:</strong> {{phone}}</p>
<p><strong>Sujet:</strong> {{subject}}</p>
<p><strong>Quantité:</strong> {{quantity}}</p>
<p><strong>Destination:</strong> {{destination}}</p>
<p><strong>Incoterm:</strong> {{incoterm}}</p>
<p><strong>Paiement:</strong> {{payment}}</p>
<p><strong>Message:</strong> {{message}}</p>
```

---

## 🔍 Vérifications Supplémentaires

### 1. Vérifier les Variables d'Environnement
Dans la console du navigateur (F12), vérifier :
```javascript
console.log({
  SERVICE: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  TEMPLATE: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: process.env.REACT_APP_EMAILJS_PUBLIC_KEY
});
```

Doit afficher :
```
{
  SERVICE: "service_pntmtmn",
  TEMPLATE: "template_1sh586m",
  PUBLIC_KEY: "oa2dvrH8lCJf974vD"
}
```

### 2. Vérifier le Public Key dans EmailJS
1. Aller dans **Account** → **General**
2. Vérifier que la **Public Key** est bien `oa2dvrH8lCJf974vD`

### 3. Redéployer si en Production
Si vous avez modifié le template, redéployez :
```bash
npm run deploy
```

---

## 📧 Contact EmailJS Support

Si l'erreur persiste :
1. Aller sur https://dashboard.emailjs.com/support
2. Créer un ticket avec :
   - Service ID: `service_pntmtmn`
   - Template ID: `template_1sh586m`
   - Erreur: 412
   - Code utilisé dans `src/services/contacts.js`

---

## ✅ Résultat Attendu

Une fois le template corrigé, l'email devrait s'envoyer sans erreur et arriver dans **manager@senharvest.com** ! 🎉

