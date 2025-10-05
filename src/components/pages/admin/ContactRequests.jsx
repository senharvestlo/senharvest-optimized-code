import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  listContactMessages, 
  getContactMessage, 
  updateContactMessageStatus, 
  deleteContactMessage 
} from '../../../services/firebaseService';

export default function ContactRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
  }, [filterStatus, loadRequests]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const result = await listContactMessages(filterStatus);
      setRequests(result.items);
    } catch (error) {
      console.error('Error loading contact requests:', error);
      alert('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (requestId) => {
    try {
      const request = await getContactMessage(requestId);
      setSelectedRequest(request);
      setShowDetails(true);
    } catch (error) {
      console.error('Error loading request details:', error);
      alert('Erreur lors du chargement des détails');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateContactMessageStatus(id, status);
      await loadRequests();
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status });
      }
      alert('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      return;
    }
    try {
      await deleteContactMessage(id);
      await loadRequests();
      if (selectedRequest && selectedRequest.id === id) {
        setShowDetails(false);
        setSelectedRequest(null);
      }
      alert('Demande supprimée avec succès');
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-purple-100 text-purple-800',
      responded: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      new: 'Nouveau',
      read: 'Lu',
      processing: 'En traitement',
      responded: 'Répondu',
      archived: 'Archivé'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.new}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des demandes...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📧 Demandes de Contact</h1>
          <p className="text-sm text-gray-600 mt-1">
            {requests.length} demande{requests.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <button 
          onClick={() => navigate('/admin/dashboard')} 
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          ← Retour
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus(null)}
          className={`px-3 py-1 rounded ${!filterStatus ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Tous
        </button>
        <button
          onClick={() => setFilterStatus('new')}
          className={`px-3 py-1 rounded ${filterStatus === 'new' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Nouveaux
        </button>
        <button
          onClick={() => setFilterStatus('processing')}
          className={`px-3 py-1 rounded ${filterStatus === 'processing' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          En traitement
        </button>
        <button
          onClick={() => setFilterStatus('responded')}
          className={`px-3 py-1 rounded ${filterStatus === 'responded' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Répondus
        </button>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Aucune demande de contact trouvée.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sujet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {request.subject || 'Sans sujet'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(request.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Détails de la demande</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {['new', 'read', 'processing', 'responded', 'archived'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(selectedRequest.id, status)}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedRequest.status === status
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {status === 'new' && 'Nouveau'}
                        {status === 'read' && 'Lu'}
                        {status === 'processing' && 'En traitement'}
                        {status === 'responded' && 'Répondu'}
                        {status === 'archived' && 'Archivé'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de réception</label>
                  <p className="mt-1 text-gray-900">{formatDate(selectedRequest.createdAt)}</p>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <p className="mt-1 text-gray-900">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">
                      <a href={`mailto:${selectedRequest.email}`} className="text-green-600 hover:underline">
                        {selectedRequest.email}
                      </a>
                    </p>
                  </div>
                </div>

                {selectedRequest.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="mt-1 text-gray-900">
                      <a href={`tel:${selectedRequest.phone}`} className="text-green-600 hover:underline">
                        {selectedRequest.phone}
                      </a>
                    </p>
                  </div>
                )}

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sujet</label>
                  <p className="mt-1 text-gray-900">{selectedRequest.subject || 'Sans sujet'}</p>
                </div>

                {/* Additional Fields */}
                {selectedRequest.quantity && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantité</label>
                    <p className="mt-1 text-gray-900">{selectedRequest.quantity}</p>
                  </div>
                )}

                {selectedRequest.destination && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Destination</label>
                    <p className="mt-1 text-gray-900">{selectedRequest.destination}</p>
                  </div>
                )}

                {selectedRequest.incoterm && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Incoterm</label>
                    <p className="mt-1 text-gray-900">{selectedRequest.incoterm}</p>
                  </div>
                )}

                {selectedRequest.payment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mode de paiement</label>
                    <p className="mt-1 text-gray-900">{selectedRequest.payment}</p>
                  </div>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.message}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => handleDelete(selectedRequest.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


