import { useI18n } from "../../i18n/I18nContext";
import { useCollection } from "../../hooks/useCollection";
import { ProvisionalBadge, EmptyState } from "../../components/ui/UiBits";
import { RentalCard } from "../../components/cards/Cards";

export default function RentalsPage() {
  const { t } = useI18n();
  const rentals = useCollection("rentals");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("more.rentals")}</div>
          <h1>{t("rentals.title")}</h1>
          <p>{t("rentals.lead")}</p>
        </div>
      </section>
      <section className="wrap" style={{ padding: "72px 0 96px" }}>
        <ProvisionalBadge source={rentals.source} />
        {rentals.items.length === 0 ? (
          <EmptyState>{t("rentals.empty")}</EmptyState>
        ) : (
          <div className="grid-3">
            {rentals.items.map((r) => <RentalCard key={r.$id} item={r} />)}
          </div>
        )}
      </section>
    </>
  );
}
