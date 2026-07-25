import { useEffect, useState } from "react";
import { listItems, updateItem, deleteItem } from "../../services/dataService";
import { getApplicationFileDownloadUrl } from "../../services/dataService";
import { isAppwriteConfigured } from "../../lib/appwrite";
import { readLocalFallback } from "../../lib/localFallback";

const STATUS_LABELS = {
  nouveau: "Nouveau",
  lu: "Lu",
  traite: "Traité",
  refuse: "Refusé",
};
const STATUS_COLORS = {
  nouveau: { bg: "#FBEFD6", fg: "#8a5f1f" },
  lu: { bg: "#E4E8F4", fg: "#33447a" },
  traite: { bg: "#E7F3EC", fg: "#1f5348" },
  refuse: { bg: "#FBEAEA", fg: "#8a1f1f" },
};

export default function AdminApplicationsPage() {
  const [items, setItems] = useState([]);
  const [source, setSource] = useState("provisoire");
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [responseDraft, setResponseDraft] = useState("");
  const [notice, setNotice] = useState("");

  async function refresh() {
    setLoading(true);
    const { items: docs, source: src } = await listItems("applications");
    const merged = isAppwriteConfigured ? docs : [...docs, ...readLocalFallback("applications")];
    setItems(merged);
    setSource(src);
    setLoading(false);
  }

  useEffect(() => { refresh(); }, []);

  function openRow(item) {
    const id = item.$id || item._savedAt;
    setOpenId(openId === id ? null : id);
    setResponseDraft(item.response || "");
  }

  async function setStatus(item, status) {
    if (!isAppwriteConfigured) { setNotice("Appwrite n'est pas configuré — action indisponible en mode démonstration."); return; }
    try {
      await updateItem("applications", item.$id, { status });
      refresh();
    } catch (err) {
      setNotice(`Erreur : ${err.message}`);
    }
  }

  async function saveResponse(item) {
    if (!isAppwriteConfigured) { setNotice("Appwrite n'est pas configuré — action indisponible en mode démonstration."); return; }
    try {
      await updateItem("applications", item.$id, { response: responseDraft, status: item.status === "nouveau" ? "traite" : item.status });
      setNotice("Réponse enregistrée.");
      refresh();
    } catch (err) {
      setNotice(`Erreur : ${err.message}`);
    }
  }

  async function remove(item) {
    if (!isAppwriteConfigured) { setNotice("Appwrite n'est pas configuré — action indisponible en mode démonstration."); return; }
    if (!confirm("Supprimer définitivement cette candidature ?")) return;
    try {
      await deleteItem("applications", item.$id);
      refresh();
    } catch (err) {
      setNotice(`Erreur : ${err.message}`);
    }
  }

  function replyMailto(item) {
    const subject = encodeURIComponent(`Votre candidature — ${item.job_title || ""}`);
    const body = encodeURIComponent(responseDraft || "");
    window.location.href = `mailto:${item.email}?subject=${subject}&body=${body}`;
  }

  return (
    <div>
      <div className="eyebrow">Back-office</div>
      <h1 style={{ fontSize: 24, marginBottom: 6 }}>Candidatures</h1>
      <p style={{ fontSize: 13.5, color: "#544D45", marginBottom: 22 }}>
        Candidatures reçues via la page Carrières, avec CV et lettre de motivation joints.
      </p>

      {!isAppwriteConfigured && (
        <div className="badge-fallback" style={{ marginBottom: 20 }}>
          ● Appwrite n'est pas configuré — les candidatures ci-dessous (le cas échéant) sont celles
          enregistrées localement dans ce navigateur en mode démonstration ; les fichiers CV/lettre
          n'ont pas pu être conservés (voir README.md).
        </div>
      )}
      {notice && <p style={{ fontSize: 13, marginBottom: 16, color: notice.startsWith("Erreur") ? "#a12" : "#1f5348" }}>{notice}</p>}

      {loading ? (
        <p className="mono" style={{ fontSize: 13 }}>Chargement…</p>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 14, color: "#544D45" }}>Aucune candidature reçue pour le moment.</p>
        </div>
      ) : (
        <div className="applications-list">
          {items.map((item) => {
            const id = item.$id || item._savedAt;
            const isOpen = openId === id;
            const status = item.status || "nouveau";
            const colors = STATUS_COLORS[status] || STATUS_COLORS.nouveau;
            const cvUrl = getApplicationFileDownloadUrl(item.cv_file_id);
            const letterUrl = getApplicationFileDownloadUrl(item.cover_letter_file_id);
            return (
              <div className="application-row" key={id}>
                <button className="application-summary" onClick={() => openRow(item)}>
                  <span className="who">
                    <strong>{item.name}</strong> — {item.job_title}
                  </span>
                  <span className="when mono">{item.date ? new Date(item.date).toLocaleDateString() : ""}</span>
                  <span className="status-pill" style={{ background: colors.bg, color: colors.fg }}>{STATUS_LABELS[status] || status}</span>
                </button>

                {isOpen && (
                  <div className="application-detail">
                    <p style={{ fontSize: 13.5, marginBottom: 6 }}><strong>Email :</strong> {item.email}</p>
                    {item.phone && <p style={{ fontSize: 13.5, marginBottom: 6 }}><strong>Téléphone :</strong> {item.phone}</p>}
                    {item.message && <p style={{ fontSize: 13.5, marginBottom: 12, whiteSpace: "pre-wrap" }}><strong>Message :</strong> {item.message}</p>}

                    <div className="files-row">
                      {cvUrl ? (
                        <a className="btn-ghost" href={cvUrl} target="_blank" rel="noopener noreferrer">↓ CV ({item.cv_file_name || "fichier"})</a>
                      ) : (
                        <span className="mono" style={{ fontSize: 12, color: "#8b8377" }}>CV : {item.cv_file_name || "non disponible en mode démonstration"}</span>
                      )}
                      {letterUrl ? (
                        <a className="btn-ghost" href={letterUrl} target="_blank" rel="noopener noreferrer">↓ Lettre ({item.cover_letter_file_name || "fichier"})</a>
                      ) : (
                        <span className="mono" style={{ fontSize: 12, color: "#8b8377" }}>Lettre : {item.cover_letter_file_name || "non disponible en mode démonstration"}</span>
                      )}
                    </div>

                    <label className="field-label" style={{ marginTop: 18 }}>Réponse (enregistrée dans le dossier, et utilisée si vous répondez par email)</label>
                    <textarea className="field-input" rows={4} value={responseDraft} onChange={(e) => setResponseDraft(e.target.value)} disabled={!isAppwriteConfigured} />

                    <div className="actions-row">
                      <button className="btn-maroon" onClick={() => saveResponse(item)} disabled={!isAppwriteConfigured}>Enregistrer la réponse</button>
                      <button className="btn-ghost" onClick={() => replyMailto(item)}>Répondre par email →</button>
                      <button className="btn-ghost" onClick={() => setStatus(item, "traite")} disabled={!isAppwriteConfigured}>Marquer traité</button>
                      <button className="btn-ghost" onClick={() => setStatus(item, "refuse")} disabled={!isAppwriteConfigured}>Marquer refusé</button>
                      <button className="btn-ghost" onClick={() => remove(item)} disabled={!isAppwriteConfigured}>Supprimer</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .applications-list{background:var(--paper); border:1px solid var(--line);}
        .application-row{border-bottom:1px solid var(--line);}
        .application-row:last-child{border-bottom:none;}
        .application-summary{
          width:100%; display:grid; grid-template-columns:1fr 140px 110px; align-items:center; gap:14px;
          padding:14px 18px; background:none; border:none; text-align:left; cursor:pointer; font-size:14px;
        }
        .application-summary:hover{background:#FBF6F6;}
        .application-summary .when{font-size:11px; color:#8b8377;}
        .status-pill{font-family:'IBM Plex Mono'; font-size:10.5px; text-transform:uppercase; padding:4px 10px; border-radius:20px; text-align:center;}
        .application-detail{padding:18px 20px 24px; border-top:1px solid var(--line); background:#FBF9F5;}
        .files-row{display:flex; gap:10px; flex-wrap:wrap; margin-top:6px;}
        .files-row a{font-size:12.5px; padding:8px 14px;}
        .field-label{display:block; font-family:'IBM Plex Mono'; font-size:11px; text-transform:uppercase; color:#8b8377; margin-bottom:6px;}
        .field-input{width:100%; border:1px solid var(--line-strong); background:var(--concrete); padding:10px 12px; font-size:14px; font-family:inherit;}
        .actions-row{display:flex; gap:10px; flex-wrap:wrap; margin-top:14px;}
        .actions-row button{font-size:12.5px; padding:8px 14px;}
        @media (max-width:700px){ .application-summary{grid-template-columns:1fr; gap:6px;} }
      `}</style>
    </div>
  );
}
