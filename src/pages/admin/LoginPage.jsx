import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";

export default function LoginPage() {
  const { login, isAppwriteConfigured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Connexion impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="card" onSubmit={handleSubmit}>
        <div className="eyebrow">Back-office</div>
        <h1 style={{ fontSize: 22, marginBottom: 20 }}>Groupe TKR — Administration</h1>

        {!isAppwriteConfigured && (
          <div className="badge-fallback" style={{ marginBottom: 18 }}>
            ● Appwrite n'est pas encore configuré (voir .env.local) — la connexion sera possible une fois le projet créé.
          </div>
        )}

        {error && <p style={{ color: "#a12", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <label className="field-label">Email</label>
        <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="field-label">Mot de passe</label>
        <input className="field-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button className="btn-maroon" style={{ marginTop: 18, width: "100%" }} disabled={loading || !isAppwriteConfigured}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <style>{`
        .admin-login{min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--charcoal); padding:20px;}
        .admin-login .card{width:100%; max-width:380px; padding:34px; background:var(--paper);}
        .field-label{display:block; font-family:'IBM Plex Mono'; font-size:11px; text-transform:uppercase; color:#8b8377; margin:14px 0 6px;}
        .field-input{width:100%; border:1px solid var(--line-strong); background:var(--concrete); padding:11px 12px; font-size:14px; font-family:inherit;}
      `}</style>
    </div>
  );
}
