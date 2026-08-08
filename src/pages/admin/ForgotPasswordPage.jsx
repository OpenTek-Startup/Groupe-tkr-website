import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import logo from "../../assets/logo-tkr.png";

export default function ForgotPasswordPage() {
  const { requestPasswordRecovery, isAppwriteConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await requestPasswordRecovery(email.trim());
      setStatus("sent");
    } catch (err) {
      // Par sécurité, on ne confirme ni n'infirme si l'email existe — mais
      // une vraie erreur réseau/config doit quand même être visible.
      const looksLikeNetworkIssue = /fetch|network|cors/i.test(err.message || "") || !err.message;
      if (looksLikeNetworkIssue) {
        setError("Impossible de joindre Appwrite depuis ce domaine — vérifiez la configuration (Overview > Platforms) dans la console Appwrite.");
        setStatus("error");
      } else {
        // Erreur "utilisateur introuvable" par ex. : on affiche quand même
        // le message de succès générique pour ne pas révéler quels emails
        // existent, mais on log l'erreur réelle pour le débogage.
        console.warn("[ForgotPassword]", err.message);
        setStatus("sent");
      }
    }
  }

  return (
    <div className="admin-login">
      <form className="card" onSubmit={handleSubmit}>
        <img src={logo} alt="Groupe TKR" className="login-logo" />
        <div className="eyebrow">Back-office</div>
        <h1 style={{ fontSize: 22, marginBottom: 20 }}>Mot de passe oublié</h1>

        {!isAppwriteConfigured && (
          <div className="badge-fallback" style={{ marginBottom: 18 }}>
            ● Appwrite n'est pas encore configuré — cette fonctionnalité sera disponible une fois le projet créé.
          </div>
        )}

        {status === "sent" ? (
          <div className="badge-fallback" style={{ background: "#E7F3EC", color: "#1f5348", borderColor: "#BFE3CC" }}>
            ✓ Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé. Pensez à vérifier vos spams.
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13.5, color: "#544D45", marginBottom: 18 }}>
              Entrez l'email de votre compte admin — un lien de réinitialisation vous sera envoyé.
            </p>
            {status === "error" && <p style={{ color: "#a12", fontSize: 13, marginBottom: 12 }}>{error}</p>}

            <label className="field-label">Email</label>
            <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" disabled={status === "sending"} />

            <button className="btn-maroon" style={{ marginTop: 18, width: "100%" }} disabled={status === "sending" || !isAppwriteConfigured}>
              {status === "sending" ? "Envoi…" : "Envoyer le lien de réinitialisation"}
            </button>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: 18 }}>
          <Link to="/admin/login" style={{ fontSize: 12.5, color: "var(--maroon)" }}>← Retour à la connexion</Link>
        </div>
      </form>

      <style>{`
        .admin-login{min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:var(--charcoal); padding:20px; gap:18px;}
        .admin-login .card{width:100%; max-width:380px; padding:34px; background:var(--paper);}
        .login-logo{width:56px; height:56px; object-fit:contain; margin-bottom:16px;}
        .field-label{display:block; font-family:'IBM Plex Mono'; font-size:11px; text-transform:uppercase; color:#8b8377; margin:14px 0 6px;}
        .field-input{width:100%; border:1px solid var(--line-strong); background:var(--concrete); padding:11px 12px; font-size:14px; font-family:inherit;}
      `}</style>
    </div>
  );
}
