# Gestion des Demandes de Contact - Documentation

## Vue d'ensemble

Ce système permet de capturer, stocker et gérer toutes les demandes de contact soumises via le formulaire "Contact Us" du site web.

## Fonctionnalités

### 1. Capture des demandes (Frontend)

Lorsqu'un visiteur remplit le formulaire de contact (`/contact`), les informations suivantes sont collectées :

- **Informations de contact** :
  - Nom complet
  - Email
  - Téléphone (optionnel)

- **Détails de la demande** :
  - Sujet de la demande
  - Message détaillé
  - Quantité souhaitée (optionnel)
  - Destination (optionnel)
  - Incoterm (FOB/CIF)
  - Mode de paiement (LC/Advance/TT)

### 2. Stockage dans Firebase

Les données sont automatiquement enregistrées dans deux endroits :

1. **Firestore** : Collection `contact_msgs`
   - Permet de consulter et gérer les demandes dans l'admin
   - Statut initial : `new`
   - Timestamp automatique (`createdAt`)

2. **Email** : Via Cloud Function
   - Envoie une notification par email
   - Utilise l'endpoint configuré dans `.env`

### 3. Interface Admin

Accès : `/admin/contact-requests` (nécessite authentification admin)

#### Tableau de bord

- **Liste des demandes** : Affichage de toutes les demandes avec :
  - Date de réception
  - Nom du demandeur
  - Email
  - Sujet
  - Statut actuel

#### Filtres disponibles

- **Tous** : Affiche toutes les demandes
- **Nouveaux** : Demandes non encore traitées
- **En traitement** : Demandes en cours de traitement
- **Répondus** : Demandes ayant reçu une réponse

#### Gestion des statuts

Chaque demande peut avoir l'un des statuts suivants :

- 🔵 **new** (Nouveau) : Demande non encore consultée
- 🟡 **read** (Lu) : Demande consultée mais pas encore traitée
- 🟣 **processing** (En traitement) : Demande en cours de traitement
- 🟢 **responded** (Répondu) : Réponse envoyée au client
- ⚫ **archived** (Archivé) : Demande archivée

#### Vue détaillée

En cliquant sur "Voir" pour une demande, vous accédez à :

- **Toutes les informations de contact** (nom, email, téléphone)
- **Détails commerciaux** (quantité, destination, incoterm, paiement)
- **Message complet** du demandeur
- **Actions possibles** :
  - Changer le statut
  - Supprimer la demande
  - Contacter directement via email/téléphone (liens cliquables)

## Configuration technique

### Services Firebase

Fichier : `src/services/firebaseService.js`

Fonctions disponibles :

```javascript
// Sauvegarder un message
saveContactMessage(data)

// Lister les messages (avec filtre optionnel)
listContactMessages(filterStatus)

// Récupérer un message spécifique
getContactMessage(id)

// Mettre à jour le statut
updateContactMessageStatus(id, status)

// Supprimer un message
deleteContactMessage(id)
```

### Composants

1. **Contact.js** : Formulaire de contact (frontend)
   - Capture les données
   - Enregistre dans Firestore
   - Envoie l'email

2. **ContactRequests.jsx** : Interface admin
   - Affichage des demandes
   - Gestion des statuts
   - Actions sur les demandes

### Routes

- `/contact` : Formulaire public
- `/admin/dashboard` : Tableau de bord admin avec lien vers les demandes
- `/admin/contact-requests` : Page de gestion des demandes (protégée)

## Structure de données Firestore

Collection : `contact_msgs`

```javascript
{
  name: string,           // Nom du demandeur
  email: string,          // Email du demandeur
  phone: string,          // Téléphone (optionnel)
  subject: string,        // Sujet de la demande
  message: string,        // Message détaillé
  quantity: string,       // Quantité (optionnel)
  destination: string,    // Destination (optionnel)
  incoterm: string,       // FOB/CIF (optionnel)
  payment: string,        // Mode de paiement (optionnel)
  status: string,         // Statut : new/read/processing/responded/archived
  createdAt: Timestamp,   // Date de création
  updatedAt: Timestamp    // Date de dernière mise à jour
}
```

## Workflow recommandé

1. **Nouveau message reçu** (statut: `new`)
   - Le formulaire envoie automatiquement l'email
   - Le message est enregistré dans Firestore

2. **Consultation** (passer à `read`)
   - L'admin ouvre le message pour le lire
   - Change le statut à "Lu"

3. **Traitement** (passer à `processing`)
   - L'admin commence à traiter la demande
   - Peut préparer une proforma ou un devis

4. **Réponse** (passer à `responded`)
   - L'admin a répondu au client
   - Le dossier est en attente de retour client

5. **Archivage** (passer à `archived`)
   - Le dossier est terminé ou annulé
   - Permet de garder l'historique sans encombrer la vue

## Sécurité

- ✅ Route protégée par authentification Firebase
- ✅ Seuls les admins peuvent accéder à `/admin/contact-requests`
- ✅ Composant `ProtectedRoute` vérifie les droits d'accès
- ✅ Les données sensibles ne sont accessibles qu'aux admins authentifiés

## Améliorations futures possibles

- 📧 Intégration avec un système d'emailing pour répondre directement depuis l'interface
- 🔔 Notifications en temps réel pour les nouvelles demandes
- 📊 Statistiques et analytics sur les demandes
- 🏷️ Système de tags/catégories pour organiser les demandes
- 💬 Historique des échanges avec chaque client
- 📎 Support des pièces jointes
- 🔍 Recherche avancée et tri personnalisé

## Support

Pour toute question ou problème :
1. Vérifiez que Firebase est correctement configuré (`.env`)
2. Assurez-vous que les collections Firestore existent
3. Vérifiez les règles de sécurité Firestore
4. Consultez les logs de la console pour les erreurs


