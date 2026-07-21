import { useState } from "react";
import { useI18n } from "../../i18n/I18nContext";

export default function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: une fois Appwrite configuré, créer un document dans une collection
    // "messages" ici (ou utiliser une Appwrite Function pour l'envoi d'email).
    setSent(true);
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("contact.eyebrow")}</div>
          <h1>{t("contact.title")}</h1>
          <p>{t("contact.lead")}</p>
        </div>
      </section>

      <section className="wrap" style={{ padding: "72px 0 96px" }}>
        <div className="grid-2" style={{ alignItems: "flex-start" }}>
          <form className="card" style={{ padding: 30 }} onSubmit={handleSubmit}>
            {sent && (
              <div className="badge-fallback" style={{ background: "#E7F3EC", color: "#1f5348", borderColor: "#BFE3CC" }}>
                ✓ Message envoyé (démonstration — à connecter à Appwrite / une adresse email réelle)
              </div>
            )}
            <label className="field-label">{t("contact.form_name")}</label>
            <input className="field-input" required />
            <label className="field-label">{t("contact.form_email")}</label>
            <input className="field-input" type="email" required />
            <label className="field-label">{t("contact.form_message")}</label>
            <textarea className="field-input" rows={5} required />
            <button type="submit" className="btn-maroon" style={{ marginTop: 10 }}>{t("contact.form_submit")}</button>
          </form>

          <div className="card" style={{ padding: 30 }}>
            <h4 style={{ fontSize: 16, marginBottom: 18 }}>{t("contact.info_title")}</h4>
            <p style={{ fontSize: 14, marginBottom: 10 }}><strong>Téléphone :</strong> [à compléter]</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}><strong>Email :</strong> [à compléter]</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}><strong>Adresse :</strong> Yaoundé, Cameroun [à préciser]</p>
            <p style={{ fontSize: 14 }}><strong>Horaires :</strong> [à compléter]</p>
          </div>
        </div>
      </section>

      <style>{`
        .field-label{display:block; font-family:'IBM Plex Mono'; font-size:11px; text-transform:uppercase; color:#8b8377; margin:16px 0 6px;}
        .field-label:first-of-type{margin-top:0;}
        .field-input{width:100%; border:1px solid var(--line-strong); background:var(--concrete); padding:11px 12px; font-size:14px; font-family:inherit; color:var(--ink);}
        textarea.field-input{resize:vertical;}
      `}</style>
    </>
  );
}
