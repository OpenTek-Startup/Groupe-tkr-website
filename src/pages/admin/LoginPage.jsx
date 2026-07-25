import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { useI18n } from "../../i18n/I18nContext";
import logo from "../../assets/logo-tkr.png";

export default function LoginPage() {
  const { login, isAppwriteConfigured } = useAuth();
  const { lang, setLang } = useI18n();
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
      <div className="admin-login-lang">
        <span className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</span>
        <span>/</span>
        <span className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</span>
      </div>
      <form className="card" onSubmit={handleSubmit}>
        <img src={logo} alt="Groupe TKR" className="login-logo" />
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
        .admin-login{min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--charcoal); padding:20px; gap:18px;}
        .admin-login-lang{font-family:'IBM Plex Mono'; font-size:12px; display:flex; gap:6px; color:#C4BCAD; cursor:pointer;}
        .admin-login-lang span{opacity:.5;}
        .admin-login-lang span.active{opacity:1; font-weight:600; color:var(--amber);}
        .admin-login .card{width:100%; max-width:380px; padding:34px; background:var(--paper);}
        .login-logo{width:56px; height:56px; object-fit:contain; margin-bottom:16px;}
        .field-label{display:block; font-family:'IBM Plex Mono'; font-size:11px; text-transform:uppercase; color:#8b8377; margin:14px 0 6px;}
        .field-input{width:100%; border:1px solid var(--line-strong); background:var(--concrete); padding:11px 12px; font-size:14px; font-family:inherit;}
      `}</style>
    </div>
  );
}
