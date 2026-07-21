import { useI18n } from "../../i18n/I18nContext";
import { useCollection } from "../../hooks/useCollection";
import { ProvisionalBadge } from "../../components/ui/UiBits";
import { TeamCard } from "../../components/cards/Cards";

export default function AboutPage() {
  const { t } = useI18n();
  const team = useCollection("team");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("about.eyebrow")}</div>
          <h1>{t("about.title")}</h1>
        </div>
      </section>

      <section className="wrap" style={{ padding: "72px 0 20px" }}>
        <ProvisionalBadge source={team.source} />
        <div className="grid-2" style={{ maxWidth: 900 }}>
          <p style={{ fontSize: 15.5, color: "#443E38" }}>{t("about.p1")}</p>
          <p style={{ fontSize: 15.5, color: "#443E38" }}>{t("about.p2")}</p>
        </div>
      </section>

      <section className="wrap" style={{ padding: "56px 0 96px" }}>
        <div className="eyebrow">{t("team.eyebrow")}</div>
        <h2 style={{ fontSize: 28, marginBottom: 30 }}>{t("team.title")}</h2>
        <div className="grid-3">
          {team.items.map((m) => <TeamCard key={m.$id} member={m} />)}
        </div>
      </section>
    </>
  );
}
