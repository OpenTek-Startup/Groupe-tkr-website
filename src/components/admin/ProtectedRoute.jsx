import { Navigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ padding: 40 }}>Chargement…</p>;

  // L'accès au back-office passe toujours par la page de connexion, qu'Appwrite
  // soit configuré ou non — tant qu'aucun compte n'existe, personne ne peut
  // entrer (voir LoginPage.jsx : le formulaire explique pourquoi la connexion
  // est momentanément indisponible plutôt que de laisser passer sans compte).
  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
}
