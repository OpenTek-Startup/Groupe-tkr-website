import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import branches from "../../data/seed/branches.json";

export default function Footer() {
  const { t, field } = useI18n();

  return (
    <footer className="tkr-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="name">GROUPE TKR</div>
            <p>{t("footer.tagline")}</p>
            <div className="foot-social">
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="X">X</a>
            </div>
          </div>
          <div>
            <h5>{t("footer.branches")}</h5>
            <ul>
              {branches.map((b) => (
                <li key={b.$id}><Link to="/activites">{field(b, "name")}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>{t("footer.nav")}</h5>
            <ul>
              <li><Link to="/">{t("nav.home")}</Link></li>
              <li><Link to="/a-propos">{t("nav.about")}</Link></li>
              <li><Link to="/realisations">{t("nav.projects")}</Link></li>
              <li><Link to="/carrieres">{t("nav.jobs")}</Link></li>
              <li><Link to="/mentions-legales">{t("nav.legal")}</Link></li>
            </ul>
          </div>
          <div>
            <h5>{t("footer.newsletter")}</h5>
            <p style={{ fontSize: 13, marginBottom: 14 }}>{t("footer.newsletter_lead")}</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={t("footer.newsletter_placeholder")} />
              <button type="submit">{t("footer.newsletter_cta")}</button>
            </form>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Groupe TKR. {t("footer.rights")}</span>
          <span>{t("footer.madeby")} <a href="#">Opentek</a></span>
        </div>
      </div>

      <style>{`
        .tkr-footer{background:var(--charcoal); color:#C4BCAD; padding:64px 0 28px;}
        .foot-grid{display:grid; grid-template-columns:1.4fr 1fr 1fr 1.2fr; gap:40px; padding-bottom:40px; border-bottom:1px solid rgba(248,245,239,.12);}
        .foot-brand .name{font-family:'Oswald'; color:var(--paper); font-size:19px; letter-spacing:.03em; margin-bottom:10px;}
        .foot-brand p{font-size:13px; max-width:32ch; margin-bottom:18px;}
        .foot-social{display:flex; gap:10px;}
        .foot-social a{width:32px; height:32px; border:1px solid rgba(248,245,239,.25); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px;}
        .tkr-footer h5{font-family:'IBM Plex Mono'; color:var(--paper); font-size:11px; letter-spacing:.08em; text-transform:uppercase; margin-bottom:16px;}
        .tkr-footer ul{list-style:none;}
        .tkr-footer ul li{margin-bottom:9px; font-size:13.5px;}
        .tkr-footer ul a:hover{color:var(--paper);}
        .newsletter-form{display:flex; border:1px solid rgba(248,245,239,.25);}
        .newsletter-form input{flex:1; background:transparent; border:none; padding:11px 12px; color:var(--paper); font-size:13px; outline:none;}
        .newsletter-form button{background:var(--amber); color:var(--charcoal); border:none; padding:0 16px; font-weight:600; font-size:12.5px;}
        .foot-bottom{display:flex; justify-content:space-between; padding-top:20px; font-size:12px; color:#847C6F; flex-wrap:wrap; gap:10px;}
        @media (max-width:900px){ .foot-grid{grid-template-columns:1fr 1fr; row-gap:32px;} }
        @media (max-width:560px){ .foot-grid{grid-template-columns:1fr;} }
      `}</style>
    </footer>
  );
}
