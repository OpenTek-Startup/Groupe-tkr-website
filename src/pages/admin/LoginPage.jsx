import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { useI18n } from "../../i18n/I18nContext";
import PasswordField from "../../components/ui/PasswordField";
import logo from "../../assets/logo-tkr.png";

export default function LoginPage() {
  const { user, loading: authLoading, login, isAppwriteConfigured } = useAuth();
  const { lang, setLang } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Si une session est déjà active (ex : connexion réussie précédemment,
  // puis retour manuel sur cette page), on ne réaffiche pas le formulaire —
  // on renvoie directement vers le tableau de bord.
  useEffect(() => {
    if (!authLoading && user) navigate("/admin", { replace: true });
  }, [authLoading, user, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      const sessionAlreadyActive = /session is active|session is prohibited/i.test(err.message || "");
      const looksLikeNetworkIssue = /fetch|network|cors/i.test(err.message || "") || !err.message;
      const looksLikeBadCredentials = err.code === 401 || /invalid credentials/i.test(err.message || "");

      if (sessionAlreadyActive) {
        // Ce n'est pas vraiment un échec : une session valide existe déjà
        // pour ce navigateur, on en profite simplement pour y aller.
        navigate("/admin");
      } else if (looksLikeNetworkIssue) {
        setError("Impossible de joindre Appwrite depuis ce domaine. Il manque probablement une étape de configuration : dans la console Appwrite, ajoutez ce site comme plateforme (Overview > Platforms > Add platform > Web app), avec le domaine exact affiché dans la barre d'adresse de votre navigateur.");
      } else if (looksLikeBadCredentials) {
        setError("Email ou mot de passe incorrect. Vérifiez qu'un utilisateur existe bien dans Appwrite (Auth > Users) — attention, ce n'est pas le compte avec lequel vous êtes connecté sur cloud.appwrite.io, mais un utilisateur créé spécifiquement pour ce projet.");
      } else {
        setError(err.message || "Connexion impossible.");
      }
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
        <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <PasswordField
          label="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <div style={{ textAlign: "right", marginTop: 8 }}>
          <Link to="/admin/forgot-password" style={{ fontSize: 12.5, color: "var(--maroon)" }}>Mot de passe oublié ?</Link>
        </div>

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
