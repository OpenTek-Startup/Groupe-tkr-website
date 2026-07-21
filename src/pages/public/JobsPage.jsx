import { useI18n } from "../../i18n/I18nContext";
import { useCollection } from "../../hooks/useCollection";
import { ProvisionalBadge, EmptyState } from "../../components/ui/UiBits";
import { JobCard } from "../../components/cards/Cards";

export default function JobsPage() {
  const { t } = useI18n();
  const jobs = useCollection("jobs");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("jobs.eyebrow")}</div>
          <h1>{t("jobs.title")}</h1>
          <p>{t("jobs.lead")}</p>
        </div>
      </section>
      <section className="wrap" style={{ padding: "72px 0 96px" }}>
        <ProvisionalBadge source={jobs.source} />
        {jobs.items.length === 0 ? (
          <EmptyState>{t("jobs.empty")}</EmptyState>
        ) : (
          <div className="grid-2">
            {jobs.items.map((j) => <JobCard key={j.$id} job={j} />)}
          </div>
        )}
      </section>
    </>
  );
}
