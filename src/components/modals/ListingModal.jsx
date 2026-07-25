import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import Modal from "../ui/Modal";
import { parseImages } from "../../lib/images";

const BRANCH_GRADIENTS = { rental: "#C4536F", land: "#DE9F3C" };
const AUTO_ADVANCE_MS = 3500;

export default function ListingModal({ item, kind, open, onClose }) {
  const { field, t } = useI18n();
  const [active, setActive] = useState(0);
  const images = item ? parseImages(item.images) : [];

  // Reset to the first slide whenever a new listing is opened.
  useEffect(() => { setActive(0); }, [item]);

  // Défilement automatique de droite à gauche lorsqu'il y a plusieurs photos.
  useEffect(() => {
    if (!open || images.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [open, images.length]);

  if (!item) return null;
  const gradient = BRANCH_GRADIENTS[kind] || "#DE9F3C";
  const metaLabel = kind === "rental"
    ? (item.rooms ? `${item.rooms} pièces` : "")
    : (item.surface || "");

  return (
    <Modal open={open} onClose={onClose} maxWidth={760}>
      <div className="listing-modal">
        <div className="listing-modal-gallery">
          {images.length > 0 ? (
            <div className="carousel-viewport">
              <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
                {images.map((src, i) => (
                  <img key={i} src={src} alt={`${field(item, "title")} — ${i + 1}/${images.length}`} className="carousel-slide" />
                ))}
              </div>
              {images.length > 1 && (
                <div className="carousel-dots">
                  {images.map((_, i) => (
                    <button key={i} className={i === active ? "active" : ""} onClick={() => setActive(i)} aria-label={`Photo ${i + 1}`} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="carousel-viewport placeholder" style={{ background: `linear-gradient(160deg, ${gradient}, #2a2419)` }}>
              <span>{t("listing.photo_soon")}</span>
            </div>
          )}
        </div>

        <div className="listing-modal-body">
          <h3>{field(item, "title")}</h3>
          <p className="loc mono">{field(item, "location")}</p>
          <div className="listing-modal-meta">
            {metaLabel && <span className="tag-pill" style={{ background: "var(--concrete-dark)", color: "var(--ink)" }}>{metaLabel}</span>}
            <span className="price">{field(item, "price")}</span>
          </div>
          <p className="desc">{field(item, "description")}</p>
          <Link
            to={`/contact?sujet=${encodeURIComponent(field(item, "title"))}`}
            className="btn-maroon"
            onClick={onClose}
          >
            {t("listing.contact_cta")}
          </Link>
        </div>
      </div>

      <style>{`
        .listing-modal{display:grid; grid-template-columns:1fr 1fr;}
        .listing-modal-gallery{background:var(--charcoal);}
        .carousel-viewport{position:relative; width:100%; aspect-ratio:4/3; overflow:hidden;}
        .carousel-viewport.placeholder{display:flex; align-items:center; justify-content:center;}
        .carousel-viewport.placeholder span{font-family:'IBM Plex Mono'; font-size:12px; color:#EEE5DC; opacity:.85;}
        .carousel-track{display:flex; height:100%; transition:transform .6s cubic-bezier(.65,0,.35,1);}
        .carousel-slide{width:100%; height:100%; object-fit:cover; flex-shrink:0; display:block;}
        .carousel-dots{position:absolute; bottom:12px; left:0; right:0; display:flex; justify-content:center; gap:7px;}
        .carousel-dots button{width:7px; height:7px; border-radius:50%; border:none; background:rgba(248,245,239,.45); padding:0; cursor:pointer;}
        .carousel-dots button.active{background:var(--amber); width:18px; border-radius:4px;}
        .listing-modal-body{padding:40px 32px;}
        .listing-modal-body h3{font-size:22px; margin-bottom:8px;}
        .listing-modal-body .loc{font-size:11px; color:#8b8377; text-transform:uppercase; margin-bottom:16px;}
        .listing-modal-meta{display:flex; align-items:center; gap:14px; margin-bottom:18px;}
        .listing-modal-meta .price{font-weight:600; color:var(--maroon); font-size:15px;}
        .listing-modal-body .desc{font-size:14.5px; color:#443E38; margin-bottom:26px; line-height:1.7;}
        @media (max-width:620px){ .listing-modal{grid-template-columns:1fr;} .listing-modal-body{padding:26px 22px;} }
      `}</style>
    </Modal>
  );
}
