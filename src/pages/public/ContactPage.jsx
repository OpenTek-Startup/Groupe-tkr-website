import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import { createItem } from "../../services/dataService";
import { saveLocalFallback } from "../../lib/localFallback";
import { useSettings } from "../../hooks/useSettings";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState({ name: "", email: "", message: "", company: "" }); // "company" = champ piège (honeypot)
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const [error, setError] = useState("");

  useEffect(() => {
    const sujet = searchParams.get("sujet");
    if (sujet) {
      setValues((v) => ({ ...v, message: t("contact.form_prefill_job").replace("{poste}", sujet) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Honeypot : un champ invisible que seuls les robots remplissent.
    if (values.company) return;

    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setError(t("contact.form_error_required"));
      setStatus("error");
      return;
    }
    if (!EMAIL_RE.test(values.email)) {
      setError(t("contact.form_error_email"));
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");
    const payload = {
      name: values.name.trim().slice(0, 150),
      email: values.email.trim().slice(0, 150),
      message: values.message.trim().slice(0, 2000),
      date: new Date().toISOString(),
    };

    try {
      await createItem("messages", payload);
    } catch {
      // Appwrite pas encore configuré : le message est conservé localement,
      // rien n'est perdu en attendant la mise en service.
      saveLocalFallback("messages", payload);
    }

    setStatus("ok");
    setValues({ name: "", email: "", message: "", company: "" });
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
          <form className="card" style={{ padding: 30 }} onSubmit={handleSubmit} noValidate>
            {status === "ok" && (
              <div className="badge-fallback" style={{ background: "#E7F3EC", color: "#1f5348", borderColor: "#BFE3CC" }}>
                ✓ {t("contact.form_success")}
              </div>
            )}
            {status === "error" && (
              <div className="badge-fallback" style={{ background: "#FBEAEA", color: "#8a1f1f", borderColor: "#EBBDBD" }}>
                {error}
              </div>
            )}

            {/* Honeypot anti-spam : champ masqué, invisible pour un humain */}
            <input
              type="text"
              name="company"
              value={values.company}
              onChange={update("company")}
              autoComplete="off"
              tabIndex={-1}
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            <label className="field-label">{t("contact.form_name")}</label>
            <input className="field-input" value={values.name} onChange={update("name")} required disabled={status === "sending"} />
            <label className="field-label">{t("contact.form_email")}</label>
            <input className="field-input" type="email" value={values.email} onChange={update("email")} required disabled={status === "sending"} />
            <label className="field-label">{t("contact.form_message")}</label>
            <textarea className="field-input" rows={5} value={values.message} onChange={update("message")} required disabled={status === "sending"} />
            <button type="submit" className="btn-maroon" style={{ marginTop: 10 }} disabled={status === "sending"}>
              {status === "sending" ? t("contact.form_sending") : t("contact.form_submit")}
            </button>
          </form>

          <div className="card" style={{ padding: 30 }}>
            <h4 style={{ fontSize: 16, marginBottom: 18 }}>{t("contact.info_title")}</h4>
            <p style={{ fontSize: 14, marginBottom: 10 }}><strong>Téléphone :</strong> {settings?.contactPhone || "[à compléter]"}</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}><strong>Email :</strong> {settings?.contactEmail || "[à compléter]"}</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}><strong>Adresse :</strong> {settings?.address || "Yaoundé, Cameroun [à préciser]"}</p>
          </div>
        </div>
      </section>

      <style>{`
        .field-label{display:block; font-family:'IBM Plex Mono'; font-size:11px; text-transform:uppercase; color:#8b8377; margin:16px 0 6px;}
        .field-label:first-of-type{margin-top:0;}
        .field-input{width:100%; border:1px solid var(--line-strong); background:var(--concrete); padding:11px 12px; font-size:14px; font-family:inherit; color:var(--ink);}
        .field-input:disabled{opacity:.6;}
        textarea.field-input{resize:vertical;}
      `}</style>
    </>
  );
}
