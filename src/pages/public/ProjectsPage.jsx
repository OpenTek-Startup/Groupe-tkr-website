import { useI18n } from "../../i18n/I18nContext";
import { useCollection } from "../../hooks/useCollection";
import { ProvisionalBadge } from "../../components/ui/UiBits";
import { ProjectCard } from "../../components/cards/Cards";

export default function ProjectsPage() {
  const { t } = useI18n();
  const projects = useCollection("projects");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("projects.eyebrow")}</div>
          <h1>{t("projects.title")}</h1>
          <p>{t("projects.lead")}</p>
        </div>
      </section>
      <section className="wrap" style={{ padding: "72px 0 96px" }}>
        <ProvisionalBadge source={projects.source} />
        <div className="grid-4">
          {projects.items.map((p) => <ProjectCard key={p.$id} project={p} />)}
        </div>
      </section>
    </>
  );
}
