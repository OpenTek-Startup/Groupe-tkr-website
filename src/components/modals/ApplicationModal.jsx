import { useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import Modal from "../ui/Modal";
import { createItem, uploadApplicationFile } from "../../services/dataService";
import { saveLocalFallback } from "../../lib/localFallback";
import { ALLOWED_APPLICATION_FILE_TYPES, MAX_APPLICATION_FILE_SIZE, isAppwriteConfigured } from "../../lib/appwrite";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fileExtOk(file) {
  const name = file.name.toLowerCase();
  return ALLOWED_APPLICATION_FILE_TYPES.some((ext) => name.endsWith(ext));
}

export default function ApplicationModal({ jobTitle, open, onClose }) {
  const { t } = useI18n();
  const [values, setValues] = useState({ name: "", email: "", phone: "", message: "", company: "" });
  const [cv, setCv] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | ok | ok_demo | error
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  }

  function handleFile(setter) {
    return (e) => {
      const file = e.target.files?.[0] || null;
      setter(file);
    };
  }

  function resetAndClose() {
    setValues({ name: "", email: "", phone: "", message: "", company: "" });
    setCv(null);
    setCoverLetter(null);
    setStatus("idle");
    setError("");
    onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (values.company) return; // honeypot

    if (!values.name.trim() || !values.email.trim() || !cv || !coverLetter) {
      setError(t("application.error_required"));
      setStatus("error");
      return;
    }
    if (!EMAIL_RE.test(values.email)) {
      setError(t("application.error_email"));
      setStatus("error");
      return;
    }
    for (const f of [cv, coverLetter]) {
      if (!fileExtOk(f)) { setError(t("application.error_file_type")); setStatus("error"); return; }
      if (f.size > MAX_APPLICATION_FILE_SIZE) { setError(t("application.error_file_size")); setStatus("error"); return; }
    }

    setStatus("sending");
    setError("");

    const base = {
      job_title: jobTitle,
      name: values.name.trim().slice(0, 150),
      email: values.email.trim().slice(0, 150),
      phone: values.phone.trim().slice(0, 40),
      message: values.message.trim().slice(0, 2000),
      status: "nouveau",
      response: "",
      date: new Date().toISOString(),
    };

    if (!isAppwriteConfigured) {
      // Mode démonstration : on ne peut pas stocker les fichiers eux-mêmes
      // sans back-end, seulement leurs noms — le candidat en est informé.
      saveLocalFallback("applications", { ...base, cv_file_name: cv.name, cover_letter_file_name: coverLetter.name });
      setStatus("ok_demo");
      return;
    }

    try {
      const [cvId, letterId] = await Promise.all([
        uploadApplicationFile(cv),
        uploadApplicationFile(coverLetter),
      ]);
      await createItem("applications", {
        ...base,
        cv_file_id: cvId,
        cv_file_name: cv.name,
        cover_letter_file_id: letterId,
        cover_letter_file_name: coverLetter.name,
      });
      setStatus("ok");
    } catch (err) {
      console.warn("[ApplicationModal] envoi impossible :", err.message);
      saveLocalFallback("applications", { ...base, cv_file_name: cv.name, cover_letter_file_name: coverLetter.name });
      setError(t("application.error_upload"));
      setStatus("error");
    }
  }

  return (
    <Modal open={open} onClose={resetAndClose} maxWidth={560}>
      <div className="application-modal">
        <div className="eyebrow">{t("jobs.eyebrow")}</div>
        <h3>{t("application.title").replace("{poste}", jobTitle)}</h3>

        {(status === "ok" || status === "ok_demo") ? (
          <div className="badge-fallback" style={{ background: "#E7F3EC", color: "#1f5348", borderColor: "#BFE3CC", marginTop: 16 }}>
            ✓ {status === "ok_demo" ? t("application.success_demo") : t("application.success")}
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {status === "error" && (
              <div className="badge-fallback" style={{ background: "#FBEAEA", color: "#8a1f1f", borderColor: "#EBBDBD" }}>{error}</div>
            )}

            <input type="text" name="company" value={values.company} onChange={update("company")} autoComplete="off" tabIndex={-1} aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

            <label className="field-label">{t("application.name")}</label>
            <input className="field-input" value={values.name} onChange={update("name")} required disabled={status === "sending"} />

            <label className="field-label">{t("application.email")}</label>
            <input className="field-input" type="email" value={values.email} onChange={update("email")} required disabled={status === "sending"} />

            <label className="field-label">{t("application.phone")}</label>
            <input className="field-input" value={values.phone} onChange={update("phone")} disabled={status === "sending"} />

            <label className="field-label">{t("application.message")}</label>
            <textarea className="field-input" rows={3} value={values.message} onChange={update("message")} disabled={status === "sending"} />

            <label className="field-label">{t("application.cv")}</label>
            <input className="field-input file-input" type="file" accept=".pdf,.doc,.docx" onChange={handleFile(setCv)} required disabled={status === "sending"} />

            <label className="field-label">{t("application.cover_letter")}</label>
            <input className="field-input file-input" type="file" accept=".pdf,.doc,.docx" onChange={handleFile(setCoverLetter)} required disabled={status === "sending"} />
            <p className="file-hint">{t("application.file_hint")}</p>

            <button type="submit" className="btn-maroon" style={{ marginTop: 14, width: "100%" }} disabled={status === "sending"}>
              {status === "sending" ? t("application.sending") : t("application.submit")}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .application-modal{padding:36px 32px;}
        .application-modal h3{font-size:20px; margin-top:8px; margin-bottom: 4px;}
        .field-label{display:block; font-family:'IBM Plex Mono'; font-size:11px; text-transform:uppercase; color:#8b8377; margin:14px 0 6px;}
        .field-input{width:100%; border:1px solid var(--line-strong); background:var(--concrete); padding:10px 12px; font-size:14px; font-family:inherit; color:var(--ink);}
        .field-input:disabled{opacity:.6;}
        textarea.field-input{resize:vertical;}
        .file-input{padding:8px 10px; cursor:pointer;}
        .file-hint{font-size:11.5px; color:#8b8377; margin-top:6px;}
      `}</style>
    </Modal>
  );
}
