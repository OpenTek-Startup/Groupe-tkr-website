import { useI18n } from "../../i18n/I18nContext";

export function SectionHead({ eyebrow, title, lead, light = false }) {
  return (
    <div className="section-head" style={light ? { color: "#C4BCAD" } : undefined}>
      <div className="eyebrow" style={light ? { color: "var(--amber)" } : undefined}>{eyebrow}</div>
      <h2 style={light ? { color: "var(--paper)" } : undefined}>{title}</h2>
      {lead && <p style={light ? { color: "#B9B2A3" } : undefined}>{lead}</p>}
    </div>
  );
}

export function ProvisionalBadge({ source }) {
  const { t } = useI18n();
  if (source !== "provisoire") return null;
  return <div className="badge-fallback">● {t("common.provisional_banner")}</div>;
}

export function Loader() {
  return <div className="state-msg">Chargement…</div>;
}

export function EmptyState({ children }) {
  return <div className="state-msg">{children}</div>;
}
