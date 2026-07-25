import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listItems, createItem, updateItem, deleteItem } from "../../services/dataService";
import { ADMIN_COLLECTIONS } from "./adminCollectionsConfig";
import { isAppwriteConfigured } from "../../lib/appwrite";

function emptyRecord(fields) {
  const rec = {};
  fields.forEach((f) => { rec[f.name] = f.type === "number" ? 0 : ""; });
  return rec;
}

// Pour les champs "imagelist", Appwrite stocke un vrai tableau d'URLs mais
// le formulaire édite une zone de texte (une URL par ligne) — ces deux
// fonctions font l'aller-retour.
function toFormValue(field, raw) {
  if (field.type === "imagelist" && Array.isArray(raw)) return raw.join("\n");
  return raw ?? "";
}
function toSaveValue(field, raw) {
  if (field.type === "imagelist") {
    return String(raw || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }
  return raw;
}

export default function CollectionManagerPage() {
  const { key } = useParams();
  const config = ADMIN_COLLECTIONS.find((c) => c.key === key);

  const [items, setItems] = useState([]);
  const [source, setSource] = useState("provisoire");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = liste, "new" = création, id = édition
  const [form, setForm] = useState({});
  const [notice, setNotice] = useState("");

  async function refresh() {
    setLoading(true);
    const { items: docs, source: src } = await listItems(key);
    setItems(docs);
    setSource(src);
    setLoading(false);
  }

  useEffect(() => { refresh(); setEditing(null); setNotice(""); }, [key]); // eslint-disable-line

  if (!config) return <p>Collection inconnue.</p>;

  function startCreate() {
    setForm(emptyRecord(config.fields));
    setEditing("new");
  }

  function startEdit(item) {
    const formData = {};
    config.fields.forEach((f) => { formData[f.name] = toFormValue(f, item[f.name]); });
    setForm({ ...item, ...formData });
    setEditing(item.$id);
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      const payload = {};
      config.fields.forEach((f) => { payload[f.name] = toSaveValue(f, form[f.name]); });
      if (editing === "new") {
        await createItem(key, payload);
        setNotice("Élément créé.");
      } else {
        await updateItem(key, editing, payload);
        setNotice("Élément mis à jour.");
      }
      setEditing(null);
      refresh();
    } catch (err) {
      setNotice(`Erreur : ${err.message}`);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer définitivement cet élément ?")) return;
    try {
      await deleteItem(key, id);
      refresh();
    } catch (err) {
      setNotice(`Erreur : ${err.message}`);
    }
  }

  return (
    <div>
      <div className="eyebrow">Back-office</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
        <h1 style={{ fontSize: 24 }}>{config.label}</h1>
        {editing === null && !config.readOnly && !config.singleton && (
          <button className="btn-maroon" onClick={startCreate} disabled={!isAppwriteConfigured}>+ Ajouter</button>
        )}
      </div>

      {!isAppwriteConfigured && (
        <div className="badge-fallback" style={{ marginBottom: 20 }}>
          ● Lecture uniquement — Appwrite n'est pas configuré. Le tableau ci-dessous affiche le contenu provisoire de src/data/seed/{key}.json.
        </div>
      )}
      {notice && <p style={{ fontSize: 13, marginBottom: 16, color: notice.startsWith("Erreur") ? "#a12" : "#1f5348" }}>{notice}</p>}

      {editing !== null ? (
        <form className="card" style={{ padding: 26, maxWidth: 640 }} onSubmit={handleSave}>
          {config.fields.map((f) => (
            <div key={f.name} style={{ marginBottom: 14 }}>
              <label className="field-label">{f.label}</label>
              {(f.type === "textarea" || f.type === "imagelist") ? (
                <textarea className="field-input" rows={f.type === "imagelist" ? 3 : 3} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              ) : (
                <input className="field-input" type={f.type === "number" ? "number" : "text"} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              )}
              {f.type === "imagelist" && <p className="file-hint">Une URL par ligne (Cloudinary ou autre).</p>}
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn-maroon">Enregistrer</button>
            <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Annuler</button>
          </div>
        </form>
      ) : loading ? (
        <p className="mono" style={{ fontSize: 13 }}>Chargement…</p>
      ) : (
        <div className="admin-table">
          <div className="admin-table-head">
            <span>{config.titleField}</span><span>Actions</span>
          </div>
          {items.map((item) => (
            <div className="admin-table-row" key={item.$id}>
              <span>{item[config.titleField] || item.$id}</span>
              <span className="row-actions">
                {!config.readOnly && (
                  <button className="btn-ghost" onClick={() => startEdit(item)} disabled={!isAppwriteConfigured}>Modifier</button>
                )}
                {!config.singleton && (
                  <button className="btn-ghost" onClick={() => handleDelete(item.$id)} disabled={!isAppwriteConfigured}>Supprimer</button>
                )}
              </span>
            </div>
          ))}
          {items.length === 0 && <p className="mono" style={{ fontSize: 13, padding: "16px 0" }}>Aucun élément.</p>}
        </div>
      )}

      <style>{`
        .field-label{display:block; font-family:'IBM Plex Mono'; font-size:11px; text-transform:uppercase; color:#8b8377; margin-bottom:6px;}
        .field-input{width:100%; border:1px solid var(--line-strong); background:var(--concrete); padding:10px 12px; font-size:14px; font-family:inherit;}
        .file-hint{font-size:11.5px; color:#8b8377; margin-top:6px;}
        .admin-table{background:var(--paper); border:1px solid var(--line);}
        .admin-table-head, .admin-table-row{display:grid; grid-template-columns:1fr 220px; padding:12px 18px; align-items:center;}
        .admin-table-head{font-family:'IBM Plex Mono'; font-size:11px; text-transform:uppercase; color:#8b8377; border-bottom:1px solid var(--line);}
        .admin-table-row{border-bottom:1px solid var(--line); font-size:14px;}
        .admin-table-row:last-child{border-bottom:none;}
        .row-actions{display:flex; gap:8px; justify-self:end;}
        .row-actions button{font-size:12px; padding:7px 12px;}
      `}</style>
    </div>
  );
}
