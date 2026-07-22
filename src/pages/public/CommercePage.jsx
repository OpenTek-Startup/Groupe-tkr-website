import { useI18n } from "../../i18n/I18nContext";
import { useCollection } from "../../hooks/useCollection";
import { ProvisionalBadge, EmptyState } from "../../components/ui/UiBits";
import { CommerceCard } from "../../components/cards/Cards";

export default function CommercePage() {
  const { t } = useI18n();
  const commerce = useCollection("commerce");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("more.commerce")}</div>
          <h1>{t("commerce.title")}</h1>
          <p>{t("commerce.lead")}</p>
        </div>
      </section>
      <section className="wrap" style={{ padding: "72px 0 96px" }}>
        <ProvisionalBadge source={commerce.source} />
        {commerce.items.length === 0 ? (
          <EmptyState>{t("commerce.empty")}</EmptyState>
        ) : (
          <div className="grid-3">
            {commerce.items.map((c) => <CommerceCard key={c.$id} item={c} />)}
          </div>
        )}
      </section>
    </>
  );
}
