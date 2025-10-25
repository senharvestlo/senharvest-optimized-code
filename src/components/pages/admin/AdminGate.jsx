import { useAuth } from '../../../context/AuthContext';
import AdminLoginModal from './AdminLoginModal';

export default function AdminGate({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="p-6">Chargement…</div>;
  if (!user || !isAdmin) return <AdminLoginModal />;
  return children;
}
