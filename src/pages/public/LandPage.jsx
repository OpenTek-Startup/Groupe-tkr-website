import { useI18n } from "../../i18n/I18nContext";
import { useCollection } from "../../hooks/useCollection";
import { ProvisionalBadge, EmptyState } from "../../components/ui/UiBits";
import { LandCard } from "../../components/cards/Cards";

export default function LandPage() {
  const { t } = useI18n();
  const lands = useCollection("lands");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("more.land")}</div>
          <h1>{t("lands.title")}</h1>
          <p>{t("lands.lead")}</p>
        </div>
      </section>
      <section className="wrap" style={{ padding: "72px 0 96px" }}>
        <ProvisionalBadge source={lands.source} />
        {lands.items.length === 0 ? (
          <EmptyState>{t("lands.empty")}</EmptyState>
        ) : (
          <div className="grid-3">
            {lands.items.map((l) => <LandCard key={l.$id} item={l} />)}
          </div>
        )}
      </section>
    </>
  );
}
