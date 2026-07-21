import { useI18n } from "../../i18n/I18nContext";

export default function LegalPage() {
  const { t } = useI18n();
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("legal.eyebrow")}</div>
          <h1>{t("legal.title")}</h1>
        </div>
      </section>
      <section className="wrap" style={{ padding: "72px 0 96px", maxWidth: 760 }}>
        <p style={{ marginBottom: 16, color: "#443E38" }}><strong>Éditeur du site :</strong> [Raison sociale du Groupe TKR à compléter]</p>
        <p style={{ marginBottom: 16, color: "#443E38" }}><strong>RCCM :</strong> [à compléter]</p>
        <p style={{ marginBottom: 16, color: "#443E38" }}><strong>Siège social :</strong> [adresse à compléter], Yaoundé, Cameroun</p>
        <p style={{ marginBottom: 16, color: "#443E38" }}><strong>Directeur de la publication :</strong> [à compléter]</p>
        <p style={{ marginBottom: 16, color: "#443E38" }}><strong>Hébergement :</strong> Vercel Inc.</p>
        <p style={{ marginBottom: 16, color: "#443E38" }}><strong>Base de données / back-office :</strong> Appwrite Cloud</p>
        <p style={{ color: "#443E38" }}><strong>Réalisation :</strong> Opentek — Département IT du Groupe TKR</p>
      </section>
    </>
  );
}
