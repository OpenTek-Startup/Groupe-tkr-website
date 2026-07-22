import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import { getItem } from "../../services/dataService";
import { ProvisionalBadge, Loader, EmptyState } from "../../components/ui/UiBits";

export default function BlogPostPage() {
  const { id } = useParams();
  const { field, t } = useI18n();
  const [state, setState] = useState({ item: null, source: "provisoire", loading: true });

  useEffect(() => {
    let mounted = true;
    setState((s) => ({ ...s, loading: true }));
    getItem("blog", id).then(({ item, source }) => {
      if (mounted) setState({ item, source, loading: false });
    });
    return () => { mounted = false; };
  }, [id]);

  if (state.loading) {
    return (
      <section className="wrap" style={{ padding: "96px 0" }}>
        <Loader />
      </section>
    );
  }

  if (!state.item) {
    return (
      <section className="wrap" style={{ padding: "96px 0" }}>
        <EmptyState>Article introuvable.</EmptyState>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link to="/blog" className="btn-ghost">← {t("blog.title")}</Link>
        </div>
      </section>
    );
  }

  const post = state.item;
  const d = new Date(post.date);
  const content = field(post, "content") || field(post, "excerpt");

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t("blog.eyebrow")}</div>
          <h1>{field(post, "title")}</h1>
          <p className="mono" style={{ color: "#B9B2A3" }}>{d.toLocaleDateString()} — {post.author}</p>
        </div>
      </section>
      <section className="wrap" style={{ padding: "72px 0 96px", maxWidth: 760 }}>
        <ProvisionalBadge source={state.source} />
        <div style={{ fontSize: 15.5, color: "#443E38", whiteSpace: "pre-wrap", lineHeight: 1.75 }}>{content}</div>
        <div style={{ marginTop: 40 }}>
          <Link to="/blog" className="btn-ghost">← {t("blog.title")}</Link>
        </div>
      </section>
    </>
  );
}
