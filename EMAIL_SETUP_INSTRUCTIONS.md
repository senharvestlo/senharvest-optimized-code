# Configuration Email pour SenHarvest Website

## Option 1 : EmailJS (Recommandé)

### Étapes de configuration :

1. **Créer un compte EmailJS** :
   - Aller sur https://www.emailjs.com/
   - Créer un compte gratuit
   - Vérifier votre email

2. **Configurer un service email** :
   - Dans le dashboard EmailJS, aller à "Email Services"
   - Cliquer sur "Add New Service"
   - Choisir votre fournisseur email (Gmail, Outlook, etc.)
   - Suivre les instructions pour connecter votre compte email

3. **Créer un template** :
   - Aller à "Email Templates"
   - Cliquer sur "Create New Template"
   - Utiliser ce template :

```
Sujet: Nouvelle demande de contact - {{subject}}

Bonjour,

Vous avez reçu une nouvelle demande de contact depuis le site web SenHarvest :

Nom: {{from_name}}
Email: {{from_email}}
Téléphone: {{phone}}
Sujet: {{subject}}
Quantité: {{quantity}}
Destination: {{destination}}
Incoterm: {{incoterm}}
Paiement: {{payment}}

Message:
{{message}}

---
Email envoyé depuis le site web SenHarvest Group
```

4. **Récupérer les IDs** :
   - Service ID : Dans "Email Services"
   - Template ID : Dans "Email Templates"
   - Public Key : Dans "Account" > "General"

5. **Mettre à jour la configuration** :
   - Ouvrir `src/config/emailjs.js`
   - Remplacer les valeurs :
     ```javascript
     export const EMAILJS_CONFIG = {
       serviceId: 'VOTRE_SERVICE_ID',
       templateId: 'VOTRE_TEMPLATE_ID',
       publicKey: 'VOTRE_PUBLIC_KEY',
     };
     ```

## Option 2 : Formspree (Plus simple)

1. Aller sur https://formspree.io/
2. Créer un compte gratuit
3. Créer un nouveau formulaire
4. Récupérer l'ID du formulaire
5. Remplacer `xqkrpozn` dans `src/utils/form.js` par votre ID

## Option 3 : Configuration manuelle

Si vous préférez, vous pouvez modifier directement le fichier `src/config/emailjs.js` avec votre email :

```javascript
export const EMAIL_CONFIG = {
  toEmail: 'votre-email@senharvest.com',
  fromName: 'SenHarvest Group Website',
  replyTo: 'votre-email@senharvest.com',
};
```

## Test

Après configuration, testez le formulaire de contact sur votre site web. Les emails devraient arriver directement dans votre boîte email.

## Support

Si vous avez des problèmes, vérifiez :
1. Les IDs dans `src/config/emailjs.js`
2. La console du navigateur pour les erreurs
3. Que votre service email est bien configuré dans EmailJS
