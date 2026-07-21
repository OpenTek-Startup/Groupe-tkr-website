import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import { useCollection } from "../../hooks/useCollection";
import { SectionHead, ProvisionalBadge } from "../../components/ui/UiBits";
import { BranchCard, ValueCard, ProjectCard, TestimonialCard } from "../../components/cards/Cards";

export default function HomePage() {
  const { t } = useI18n();
  const branches = useCollection("branches");
  const values = useCollection("values");
  const projects = useCollection("projects");
  const testimonials = useCollection("testimonials");

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="eyebrow" style={{ color: "var(--amber)" }}>{t("hero.eyebrow")}</div>
            <h1>
              {t("hero.title1")} <em>{t("hero.title2")}</em>{t("hero.title3")}
            </h1>
            <p className="lead">{t("hero.lead")}</p>
            <div className="hero-ctas">
              <Link to="/activites" className="btn-primary">{t("hero.cta1")}</Link>
              <Link to="/realisations" className="btn-ghost" style={{ color: "var(--paper)", borderColor: "rgba(248,245,239,.35)" }}>{t("hero.cta2")}</Link>
            </div>
            <div className="stats">
              <div><div className="num">12+</div><div className="lbl">{t("hero.stat1")}</div></div>
              <div><div className="num">80+</div><div className="lbl">{t("hero.stat2")}</div></div>
              <div><div className="num">04</div><div className="lbl">{t("hero.stat3")}</div></div>
              <div><div className="num">200+</div><div className="lbl">{t("hero.stat4")}</div></div>
            </div>
          </div>
          <div className="hero-visual bp-frame">
            <span className="bp-tr" /><span className="bp-br" />
            <div className="frame-fill">
              <svg viewBox="0 0 300 375" style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
                <polyline points="20,180 150,60 280,180" stroke="#DE9F3C" strokeWidth="2" fill="none" />
                <line x1="60" y1="180" x2="60" y2="330" stroke="#DE9F3C" strokeWidth="1" />
                <line x1="240" y1="180" x2="240" y2="330" stroke="#DE9F3C" strokeWidth="1" />
                <rect x="130" y="230" width="40" height="100" fill="none" stroke="#C4BCAD" strokeWidth="1" />
                <line x1="20" y1="330" x2="280" y2="330" stroke="#C4BCAD" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
              <div className="caption">FIG. 01 — Coupe schématique — chantier type<br />Groupe TKR / Division BTP</div>
            </div>
          </div>
        </div>
      </section>

      <div className="strip">
        <span>★ GÉNIE CIVIL & BTP</span><span>★ LOCATION DE MAISONS</span><span>★ VENTE DE TERRAINS</span><span>★ ÉLEVAGE & VENTE DE POISSONS</span><span>★ IT & INFOGRAPHIE — OPENTEK</span>
        <span>★ GÉNIE CIVIL & BTP</span><span>★ LOCATION DE MAISONS</span><span>★ VENTE DE TERRAINS</span><span>★ ÉLEVAGE & VENTE DE POISSONS</span><span>★ IT & INFOGRAPHIE — OPENTEK</span>
      </div>

      <section className="about-section">
        <div className="wrap">
          <ProvisionalBadge source={branches.source} />
          <SectionHead eyebrow={t("about.eyebrow")} title={t("about.title")} />
          <div className="about-grid">
            <div className="about-copy">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
              <div className="sig">{t("about.sig")}</div>
            </div>
            <div className="pillars-mini">
              {branches.items.map((b) => (
                <div className="pillar-mini" key={b.$id}>
                  <div className="bar" style={{ background: { amber: "#DE9F3C", brick: "#C4536F", teal: "#4FA391", indigo: "#8377D6" }[b.color] }} />
                  <div className="idx">{b.code} — {b.name_fr}</div>
                  <h4>{b.title_fr}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="wrap">
          <div className="values-row">
            {values.items.map((v, i) => <ValueCard key={v.$id} value={v} index={i} />)}
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="wrap">
          <SectionHead light eyebrow={t("services.eyebrow")} title={t("services.title")} lead={t("services.lead")} />
          <div className="branch-grid">
            {branches.items.map((b) => <BranchCard key={b.$id} branch={b} />)}
          </div>
        </div>
      </section>

      <section className="portfolio-section">
        <div className="wrap">
          <SectionHead eyebrow={t("projects.eyebrow")} title={t("projects.title")} lead={t("projects.lead")} />
          <div className="proj-grid">
            {projects.items.slice(0, 4).map((p) => <ProjectCard key={p.$id} project={p} />)}
          </div>
        </div>
      </section>

      <section className="testi-section">
        <div className="wrap">
          <SectionHead eyebrow={t("testimonials.eyebrow")} title={t("testimonials.title")} />
          <div className="testi-grid">
            {testimonials.items.map((item) => <TestimonialCard key={item.$id} item={item} />)}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap cta-band-inner">
          <h2>{t("contact.title")}</h2>
          <Link to="/contact" className="btn-primary">{t("contact.eyebrow")}</Link>
        </div>
      </section>

      <style>{`
        .hero{padding:88px 0 72px; background:
          linear-gradient(rgba(27,24,21,.86), rgba(27,24,21,.86)),
          repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(222,159,60,.08) 39px, rgba(222,159,60,.08) 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(222,159,60,.08) 39px, rgba(222,159,60,.08) 40px),
          var(--charcoal); color:var(--concrete);}
        .hero-grid{display:grid; grid-template-columns:1.15fr .85fr; gap:52px; align-items:center;}
        .hero h1{color:var(--paper); font-size:48px; font-weight:600; margin-bottom:20px; max-width:12em;}
        .hero h1 em{font-style:normal; color:var(--amber);}
        .hero p.lead{font-size:16px; color:#D8D2C6; max-width:46ch; margin-bottom:30px;}
        .hero-ctas{display:flex; gap:14px; margin-bottom:48px; flex-wrap:wrap;}
        .stats{display:flex; border-top:1px solid rgba(248,245,239,.18);}
        .stats div{flex:1; padding:16px 20px 0 0; border-right:1px solid rgba(248,245,239,.18);}
        .stats div:last-child{border-right:none;}
        .stats .num{font-family:'IBM Plex Mono'; font-size:24px; color:var(--amber); font-weight:600;}
        .stats .lbl{font-size:11px; color:#B9B2A3; text-transform:uppercase; margin-top:2px;}
        .hero-visual{aspect-ratio:4/5; position:relative; border:1px solid rgba(248,245,239,.2);}
        .hero-visual .bp-tr, .hero-visual::before, .hero-visual::after, .hero-visual .bp-br{border-color:rgba(248,245,239,.55);}
        .frame-fill{position:absolute; inset:14px; background:linear-gradient(160deg, rgba(222,159,60,.18), transparent 55%), linear-gradient(340deg, rgba(110,18,32,.35), transparent 55%), #2A2521; display:flex; align-items:flex-end; padding:20px;}
        .caption{font-family:'IBM Plex Mono'; font-size:11px; color:#C9C2B4;}
        .strip{background:var(--maroon); color:var(--paper); overflow:hidden; white-space:nowrap; padding:10px 0; font-family:'IBM Plex Mono'; font-size:12px;}
        .strip span{display:inline-block; padding-right:56px;}
        .about-section{padding:88px 0 36px;}
        .about-grid{display:grid; grid-template-columns:.9fr 1.1fr; gap:56px;}
        .about-copy p{color:#443E38; margin-bottom:14px; font-size:15px; max-width:52ch;}
        .about-copy .sig{font-family:'Oswald'; font-size:14px; color:var(--maroon); margin-top:18px;}
        .pillars-mini{display:grid; grid-template-columns:1fr 1fr; gap:14px;}
        .pillar-mini{background:var(--paper); border:1px solid var(--line); padding:20px; position:relative;}
        .pillar-mini .idx{font-family:'IBM Plex Mono'; font-size:10.5px; color:#8b8377; margin-bottom:12px;}
        .pillar-mini h4{font-size:14px;}
        .pillar-mini .bar{position:absolute; left:0; top:0; bottom:0; width:3px;}
        .values-section{padding:36px 0 88px;}
        .values-row{display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--line-strong); border:1px solid var(--line-strong);}
        .services-section{padding:88px 0; background:var(--charcoal);}
        .branch-grid{display:grid; grid-template-columns:1fr 1fr; gap:18px;}
        .portfolio-section{padding:88px 0;}
        .proj-grid{display:grid; grid-template-columns:repeat(4,1fr); gap:16px;}
        .testi-section{padding:0 0 88px;}
        .testi-grid{display:grid; grid-template-columns:1fr 1fr; gap:22px;}
        .cta-band{background:var(--maroon); color:var(--paper); padding:60px 0;}
        .cta-band-inner{display:flex; justify-content:space-between; align-items:center; gap:32px; flex-wrap:wrap;}
        .cta-band h2{color:var(--paper); font-size:26px; max-width:14em;}
        @media (max-width:900px){
          .hero-grid, .about-grid{grid-template-columns:1fr;}
          .hero h1{font-size:34px;}
          .values-row, .branch-grid, .proj-grid, .testi-grid{grid-template-columns:1fr 1fr;}
        }
        @media (max-width:560px){
          .values-row, .branch-grid, .proj-grid, .testi-grid, .pillars-mini{grid-template-columns:1fr;}
          .stats{flex-wrap:wrap;} .stats div{flex:1 1 45%; margin-bottom:12px;}
        }
      `}</style>
    </>
  );
}
