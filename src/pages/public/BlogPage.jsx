import { useI18n } from "../../i18n/I18nContext";
import { useCollection } from "../../hooks/useCollection";
import { ProvisionalBadge, EmptyState } from "../../components/ui/UiBits";
import { BlogCard } from "../../components/cards/Cards";

export default function BlogPage() {
  const { t } = useI18n();
  const posts = useCollection("blog");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("blog.eyebrow")}</div>
          <h1>{t("blog.title")}</h1>
        </div>
      </section>
      <section className="wrap" style={{ padding: "72px 0 96px" }}>
        <ProvisionalBadge source={posts.source} />
        {posts.items.length === 0 ? (
          <EmptyState>{t("blog.empty")}</EmptyState>
        ) : (
          <div className="grid-3">
            {posts.items.map((p) => <BlogCard key={p.$id} post={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
