import { useI18n } from "../../i18n/I18nContext";
import { useCollection } from "../../hooks/useCollection";
import { ProvisionalBadge, EmptyState } from "../../components/ui/UiBits";
import { EventCard } from "../../components/cards/Cards";

export default function EventsPage() {
  const { t } = useI18n();
  const events = useCollection("events");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("events.eyebrow")}</div>
          <h1>{t("events.title")}</h1>
        </div>
      </section>
      <section className="wrap" style={{ padding: "72px 0 96px" }}>
        <ProvisionalBadge source={events.source} />
        {events.items.length === 0 ? (
          <EmptyState>{t("events.empty")}</EmptyState>
        ) : (
          <div className="grid-2">
            {events.items.map((ev) => <EventCard key={ev.$id} event={ev} />)}
          </div>
        )}
      </section>
    </>
  );
}
