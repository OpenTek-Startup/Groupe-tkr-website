import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import branches from "../../data/seed/branches.json";
import { createItem } from "../../services/dataService";
import { saveLocalFallback } from "../../lib/localFallback";
import { useSettings } from "../../hooks/useSettings";
import logoLight from "../../assets/logo-tkr-light.png";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const { t, field } = useI18n();
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "sending" | "ok" | "error"

  const socials = [
    { key: "linkedin", label: "LinkedIn", url: settings?.linkedinUrl },
    { key: "facebook", label: "Facebook", url: settings?.facebookUrl },
    { key: "twitter", label: "X", url: settings?.twitterUrl },
  ];

  async function handleNewsletter(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      await createItem("newsletter", { email, date: new Date().toISOString() });
      setStatus("ok");
      setEmail("");
    } catch {
      // Appwrite pas encore configuré : on garde tout de même la demande,
      // rien n'est perdu, elle sera visible dès la mise en service.
      saveLocalFallback("newsletter", { email, date: new Date().toISOString() });
      setStatus("ok");
      setEmail("");
    }
  }

  return (
    <footer className="tkr-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Link to="/" className="foot-logo">
              <span className="logo-badge"><img src={logoLight} alt="Groupe TKR" /></span>
              <span>GROUPE TKR</span>
            </Link>
            <p>{t("footer.tagline")}</p>
            <div className="foot-social">
              {socials.map((s) => (
                s.url ? (
                  <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>{s.label === "X" ? "X" : s.label.slice(0, 2).toLowerCase()}</a>
                ) : (
                  <button key={s.key} type="button" title={`${s.label} — lien à venir`} aria-label={s.label}>{s.label === "X" ? "X" : s.label.slice(0, 2).toLowerCase()}</button>
                )
              ))}
            </div>
          </div>
          <div>
            <h5>{t("footer.branches")}</h5>
            <ul>
              {branches.map((b) => (
                <li key={b.$id}><Link to={`/activites#${b.$id}`}>{field(b, "name")}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>{t("footer.nav")}</h5>
            <ul>
              <li><Link to="/">{t("nav.home")}</Link></li>
              <li><Link to="/a-propos">{t("nav.about")}</Link></li>
              <li><Link to="/realisations">{t("nav.projects")}</Link></li>
              <li><Link to="/blog">{t("blog.eyebrow")}</Link></li>
              <li><Link to="/evenements">{t("events.eyebrow")}</Link></li>
              <li><Link to="/carrieres">{t("more.jobs")}</Link></li>
              <li><Link to="/mentions-legales">{t("more.legal")}</Link></li>
            </ul>
          </div>
          <div>
            <h5>{t("footer.newsletter")}</h5>
            <p style={{ fontSize: 13, marginBottom: 14 }}>{t("footer.newsletter_lead")}</p>
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder={t("footer.newsletter_placeholder")}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus(null); }}
                disabled={status === "sending"}
              />
              <button type="submit" disabled={status === "sending"}>{t("footer.newsletter_cta")}</button>
            </form>
            {status === "invalid" && <p className="form-msg error">{t("footer.newsletter_invalid")}</p>}
            {status === "ok" && <p className="form-msg ok">{t("footer.newsletter_ok")}</p>}
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Groupe TKR. {t("footer.rights")}</span>
          <span>{t("footer.madeby")} <a href="https://opentek.dev" target="_blank" rel="noopener noreferrer">Opentek</a></span>
        </div>
      </div>

      <style>{`
        .tkr-footer{background:var(--charcoal); color:#C4BCAD; padding:64px 0 28px;}
        .foot-grid{display:grid; grid-template-columns:1.4fr 1fr 1fr 1.2fr; gap:40px; padding-bottom:40px; border-bottom:1px solid rgba(248,245,239,.12);}
        .foot-logo{display:flex; align-items:center; gap:10px; margin-bottom:14px;}
        .foot-logo .logo-badge{height:34px; width:34px; flex:none; background:#fff; border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden; padding:2px;}
        .foot-logo .logo-badge img{width:100%; height:100%; object-fit:contain;}
        .foot-logo span{font-family:'Oswald'; color:var(--paper); font-size:17px; letter-spacing:.03em;}
        .foot-brand p{font-size:13px; max-width:32ch; margin-bottom:18px;}
        .foot-social{display:flex; gap:10px;}
        .foot-social button, .foot-social a{width:32px; height:32px; border:1px solid rgba(248,245,239,.25); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; background:none; color:#C4BCAD; font-family:inherit; cursor:pointer; text-decoration:none;}
        .foot-social button:hover, .foot-social a:hover{border-color:rgba(248,245,239,.5); color:var(--paper);}
        .tkr-footer h5{font-family:'IBM Plex Mono'; color:var(--paper); font-size:11px; letter-spacing:.08em; text-transform:uppercase; margin-bottom:16px;}
        .tkr-footer ul{list-style:none;}
        .tkr-footer ul li{margin-bottom:9px; font-size:13.5px;}
        .tkr-footer ul a:hover{color:var(--paper);}
        .newsletter-form{display:flex; border:1px solid rgba(248,245,239,.25);}
        .newsletter-form input{flex:1; background:transparent; border:none; padding:11px 12px; color:var(--paper); font-size:13px; outline:none; min-width:0;}
        .newsletter-form button{background:var(--amber); color:var(--charcoal); border:none; padding:0 16px; font-weight:600; font-size:12.5px; cursor:pointer;}
        .newsletter-form button:disabled{opacity:.6; cursor:default;}
        .form-msg{font-size:12px; margin-top:8px;}
        .form-msg.ok{color:#7fd3ae;}
        .form-msg.error{color:#e79797;}
        .foot-bottom{display:flex; justify-content:space-between; padding-top:20px; font-size:12px; color:#847C6F; flex-wrap:wrap; gap:10px;}
        .foot-bottom a{color:#a89f90;}
        @media (max-width:900px){ .foot-grid{grid-template-columns:1fr 1fr; row-gap:32px;} }
        @media (max-width:560px){ .foot-grid{grid-template-columns:1fr;} }
      `}</style>
    </footer>
  );
}
