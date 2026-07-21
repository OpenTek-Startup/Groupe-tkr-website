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
    setForm({ ...item });
    setEditing(item.$id);
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (editing === "new") {
        await createItem(key, form);
        setNotice("Élément créé.");
      } else {
        const { $id, $createdAt, $updatedAt, $permissions, $collectionId, $databaseId, ...data } = form;
        await updateItem(key, editing, data);
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
        {editing === null && (
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
              {f.type === "textarea" ? (
                <textarea className="field-input" rows={3} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              ) : (
                <input className="field-input" type={f.type === "number" ? "number" : "text"} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              )}
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
                <button className="btn-ghost" onClick={() => startEdit(item)} disabled={!isAppwriteConfigured}>Modifier</button>
                <button className="btn-ghost" onClick={() => handleDelete(item.$id)} disabled={!isAppwriteConfigured}>Supprimer</button>
              </span>
            </div>
          ))}
          {items.length === 0 && <p className="mono" style={{ fontSize: 13, padding: "16px 0" }}>Aucun élément.</p>}
        </div>
      )}

      <style>{`
        .field-label{display:block; font-family:'IBM Plex Mono'; font-size:11px; text-transform:uppercase; color:#8b8377; margin-bottom:6px;}
        .field-input{width:100%; border:1px solid var(--line-strong); background:var(--concrete); padding:10px 12px; font-size:14px; font-family:inherit;}
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
