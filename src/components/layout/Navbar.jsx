import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";

const LINKS = [
  { to: "/", key: "home" },
  { to: "/a-propos", key: "about" },
  { to: "/activites", key: "services" },
  { to: "/realisations", key: "projects" },
  { to: "/carrieres", key: "jobs" },
  { to: "/contact", key: "contact" },
];

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <nav className="navbar-inner wrap">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <svg className="brand-mark" viewBox="0 0 100 100" fill="none" width="36" height="36">
            <path d="M50 10 L92 46 L84 46 L84 88 L16 88 L16 46 L8 46 Z" fill="#1B1815" />
            <rect x="42" y="52" width="16" height="36" fill="#6E1220" />
            <rect x="24" y="30" width="10" height="16" fill="#6E1220" />
          </svg>
          <div className="brand-text">
            <div className="name">GROUPE TKR</div>
            <div className="tag">{lang === "fr" ? "LE TGV DE LA CONSTRUCTION" : "THE CONSTRUCTION TGV"}</div>
          </div>
        </Link>

        <div className={`nav-links ${open ? "open" : ""}`}>
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? "active" : "")}>
              {t(`nav.${l.key}`)}
            </NavLink>
          ))}
        </div>

        <div className="nav-right">
          <div className="lang">
            <span className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</span>
            <span>/</span>
            <span className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</span>
          </div>
          <Link to="/contact" className="cta">{t("nav.cta")}</Link>
          <button className="burger" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <style>{`
        .navbar{position:sticky; top:0; z-index:40; background:rgba(237,232,224,.94); backdrop-filter:blur(8px); border-bottom:1px solid var(--line);}
        .navbar-inner{display:flex; align-items:center; justify-content:space-between; padding:14px 32px;}
        .brand{display:flex; align-items:center; gap:12px;}
        .brand-text .name{font-family:'Oswald'; font-weight:700; font-size:17px; letter-spacing:.03em; color:var(--maroon);}
        .brand-text .tag{font-family:'IBM Plex Mono'; font-size:9px; letter-spacing:.06em; color:var(--ink);}
        .nav-links{display:flex; gap:28px; align-items:center;}
        .nav-links a{font-size:14px; font-weight:500; color:var(--ink); position:relative; padding:4px 0;}
        .nav-links a::after{content:""; position:absolute; left:0; bottom:-2px; width:0; height:2px; background:var(--maroon); transition:width .25s ease;}
        .nav-links a:hover::after, .nav-links a.active::after{width:100%;}
        .nav-links a.active{color:var(--maroon);}
        .nav-right{display:flex; align-items:center; gap:18px;}
        .lang{font-family:'IBM Plex Mono'; font-size:12px; border:1px solid var(--line-strong); border-radius:20px; padding:5px 12px; display:flex; gap:6px; cursor:pointer;}
        .lang span{opacity:.45;}
        .lang span.active{opacity:1; font-weight:600; color:var(--maroon);}
        .cta{background:var(--maroon); color:var(--paper); padding:9px 18px; font-size:13px; font-weight:600; border-radius:2px;}
        .cta:hover{background:var(--maroon-dark);}
        .burger{display:none; flex-direction:column; gap:4px; background:none; border:none;}
        .burger span{width:22px; height:2px; background:var(--ink); display:block;}
        @media (max-width:900px){
          .nav-links{display:none; position:absolute; top:100%; left:0; right:0; background:var(--paper); flex-direction:column; align-items:flex-start; padding:20px 32px; border-bottom:1px solid var(--line); gap:16px;}
          .nav-links.open{display:flex;}
          .burger{display:flex;}
          .cta{display:none;}
        }
      `}</style>
    </header>
  );
}
