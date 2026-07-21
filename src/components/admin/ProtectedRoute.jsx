import { Navigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, isAppwriteConfigured } = useAuth();

  if (loading) return <p style={{ padding: 40 }}>Chargement…</p>;

  // Tant qu'Appwrite n'est pas configuré, on laisse passer en lecture seule
  // pour permettre de visualiser la structure du back-office.
  if (!isAppwriteConfigured) return children;

  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
}
