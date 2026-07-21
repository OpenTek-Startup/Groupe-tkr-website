import { Link } from "react-router-dom";
import { isAppwriteConfigured } from "../../lib/appwrite";
import { ADMIN_COLLECTIONS } from "./adminCollectionsConfig";

export default function DashboardPage() {
  return (
    <div>
      <div className="eyebrow">Back-office</div>
      <h1 style={{ fontSize: 26, marginBottom: 24 }}>Tableau de bord</h1>

      {!isAppwriteConfigured && (
        <div className="badge-fallback" style={{ marginBottom: 28 }}>
          ● Appwrite n'est pas encore configuré — le site public affiche le contenu provisoire de src/data/seed.
          Ajoutez vos identifiants Appwrite dans .env.local pour activer l'édition en ligne (voir README.md).
        </div>
      )}

      <div className="grid-3">
        {ADMIN_COLLECTIONS.map((c) => (
          <Link key={c.key} to={`/admin/collections/${c.key}`} className="card" style={{ padding: 22 }}>
            <h4 style={{ fontSize: 15, marginBottom: 6 }}>{c.label}</h4>
            <p style={{ fontSize: 13, color: "#544D45" }}>Gérer le contenu « {c.label.toLowerCase()} » affiché sur le site public.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
