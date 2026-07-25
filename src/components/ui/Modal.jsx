import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, children, maxWidth = 640 }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="tkr-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="tkr-modal-panel" style={{ maxWidth }} role="dialog" aria-modal="true">
        <button className="tkr-modal-close" aria-label="Fermer" onClick={onClose}>×</button>
        {children}
      </div>
      <style>{`
        .tkr-modal-backdrop{
          position:fixed; inset:0; background:rgba(20,17,15,.72); z-index:200;
          display:flex; align-items:center; justify-content:center; padding:24px;
          animation:tkr-fade .15s ease;
        }
        .tkr-modal-panel{
          background:var(--paper); width:100%; max-height:88vh; overflow-y:auto;
          position:relative; border:1px solid var(--line-strong);
        }
        .tkr-modal-close{
          position:absolute; top:12px; right:12px; width:34px; height:34px; border:none;
          background:var(--charcoal); color:var(--paper); font-size:20px; line-height:1;
          border-radius:50%; cursor:pointer; z-index:5;
        }
        .tkr-modal-close:hover{background:var(--maroon);}
        @keyframes tkr-fade{ from{opacity:0;} to{opacity:1;} }
      `}</style>
    </div>,
    document.body
  );
}
