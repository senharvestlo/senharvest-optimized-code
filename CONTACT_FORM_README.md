# 📧 Configuration du Formulaire de Contact - SenHarvest

## ✅ Configuration Actuelle

Votre formulaire de contact est maintenant configuré pour envoyer les emails à :
**abdoulahat.lo@senharvest.com**

## 🔧 Comment ça fonctionne

1. **Client remplit le formulaire** → Clique sur "Envoyer"
2. **Client email s'ouvre** → Avec un message pré-rempli
3. **Client envoie l'email** → Vous recevez la demande
4. **Vous répondez** → Directement depuis votre boîte email

## 📝 Informations reçues dans l'email

- **Nom du client**
- **Email du client** (pour répondre)
- **Téléphone**
- **Sujet de la demande**
- **Quantité souhaitée**
- **Destination**
- **Incoterm** (FOB, CIF, etc.)
- **Mode de paiement**
- **Message détaillé**

## 🧪 Test du formulaire

1. Allez sur la page "Contact" de votre site
2. Cliquez sur "Test Email"
3. Votre client email s'ouvrira avec un email de test
4. Envoyez-le pour vérifier que tout fonctionne

## 🔄 Changer l'adresse email

Si vous voulez changer l'email de réception :

1. Ouvrez le fichier `src/config/email.js`
2. Modifiez la ligne : `toEmail: 'votre-nouvel-email@senharvest.com'`
3. Sauvegardez le fichier
4. Redémarrez le serveur : `npm start`

## 📱 Compatibilité

- ✅ **Gmail** : Fonctionne parfaitement
- ✅ **Outlook** : Fonctionne parfaitement  
- ✅ **Apple Mail** : Fonctionne parfaitement
- ✅ **Tous les clients email** : Compatible

## 🚀 Avantages de cette solution

- **Simple** : Pas de configuration complexe
- **Fiable** : Fonctionne sur tous les appareils
- **Sécurisé** : Pas de données stockées
- **Professionnel** : Email bien formaté
- **Rapide** : Configuration en 2 minutes

## 📞 Support

Si vous avez des questions ou des problèmes :
1. Vérifiez que votre client email est configuré
2. Testez avec le bouton "Test Email"
3. Vérifiez la console du navigateur pour les erreurs

---
**Status** : ✅ Configuré et prêt à utiliser !
