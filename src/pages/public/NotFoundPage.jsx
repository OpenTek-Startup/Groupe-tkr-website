import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <section className="wrap" style={{ padding: "120px 0", textAlign: "center" }}>
      <div className="eyebrow" style={{ justifyContent: "center" }}>404</div>
      <h1 style={{ fontSize: 34, marginBottom: 14 }}>Page introuvable</h1>
      <p style={{ color: "#544D45", marginBottom: 30 }}>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-maroon">{t("nav.home")}</Link>
    </section>
  );
}
