import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import PasswordField from "../../components/ui/PasswordField";
import logo from "../../assets/logo-tkr.png";

export default function ResetPasswordPage() {
  const { completePasswordRecovery, isAppwriteConfigured } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const [error, setError] = useState("");

  const linkLooksValid = Boolean(userId && secret);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setStatus("error");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setError("");
    try {
      await completePasswordRecovery(userId, secret, password);
      setStatus("done");
      setTimeout(() => navigate("/admin/login"), 2500);
    } catch (err) {
      const expired = /invalid token|expired/i.test(err.message || "");
      setError(
        expired
          ? "Ce lien de réinitialisation a expiré ou a déjà été utilisé. Demandez-en un nouveau."
          : (err.message || "Impossible de réinitialiser le mot de passe.")
      );
      setStatus("error");
    }
  }

  return (
    <div className="admin-login">
      <form className="card" onSubmit={handleSubmit}>
        <img src={logo} alt="Groupe TKR" className="login-logo" />
        <div className="eyebrow">Back-office</div>
        <h1 style={{ fontSize: 22, marginBottom: 20 }}>Nouveau mot de passe</h1>

        {!isAppwriteConfigured ? (
          <div className="badge-fallback">● Appwrite n'est pas encore configuré.</div>
        ) : !linkLooksValid ? (
          <div className="badge-fallback" style={{ background: "#FBEAEA", color: "#8a1f1f", borderColor: "#EBBDBD" }}>
            Ce lien est incomplet ou invalide. Utilisez le lien reçu par email depuis la page « Mot de passe oublié ».
          </div>
        ) : status === "done" ? (
          <div className="badge-fallback" style={{ background: "#E7F3EC", color: "#1f5348", borderColor: "#BFE3CC" }}>
            ✓ Mot de passe mis à jour. Redirection vers la connexion…
          </div>
        ) : (
          <>
            {status === "error" && <p style={{ color: "#a12", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <PasswordField label="Nouveau mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" disabled={status === "saving"} />
            <PasswordField label="Confirmer le mot de passe" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" disabled={status === "saving"} />
            <button className="btn-maroon" style={{ marginTop: 18, width: "100%" }} disabled={status === "saving"}>
              {status === "saving" ? "Enregistrement…" : "Réinitialiser le mot de passe"}
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
