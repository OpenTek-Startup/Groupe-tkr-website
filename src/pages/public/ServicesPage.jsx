import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import { useCollection } from "../../hooks/useCollection";
import { ProvisionalBadge } from "../../components/ui/UiBits";
import { CommerceCard } from "../../components/cards/Cards";
import { relationId } from "../../lib/relations";

const BRANCH_COLORS = { btp: "#DE9F3C", immobilier: "#C4536F", aquaculture: "#4FA391", opentek: "#8377D6", commerce: "#5C7A8A" };

export default function ServicesPage() {
  const { field, t } = useI18n();
  const branches = useCollection("branches");
  const services = useCollection("services");
  const commerce = useCollection("commerce");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("services.eyebrow")}</div>
          <h1>{t("services.title")}</h1>
          <p>{t("services.lead")}</p>
        </div>
      </section>

      <section className="wrap" style={{ padding: "72px 0 96px" }}>
        <ProvisionalBadge source={services.source} />
        {branches.items.map((b) => (
          <div key={b.$id} id={b.$id} style={{ marginBottom: 56, scrollMarginTop: 96 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: BRANCH_COLORS[b.$id] }} />
              <h3 style={{ fontSize: 22 }}>{field(b, "title")}</h3>
            </div>
            {b.$id === "commerce" ? (
              <>
                <div className="grid-3">
                  {commerce.items.map((c) => <CommerceCard key={c.$id} item={c} />)}
                </div>
                <Link to="/commerce-general" className="btn-ghost" style={{ marginTop: 18, display: "inline-block" }}>{t("services.more")} →</Link>
              </>
            ) : (
              <div className="grid-3">
                {services.items.filter((s) => relationId(s.branch) === b.$id).map((s) => (
                  <div className="card" key={s.$id} style={{ padding: 24 }}>
                    <h4 style={{ fontSize: 15.5, marginBottom: 8, fontFamily: "Oswald", textTransform: "uppercase" }}>{field(s, "title")}</h4>
                    <p style={{ fontSize: 13.5, color: "#544D45" }}>{field(s, "description")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>
    </>
  );
}
