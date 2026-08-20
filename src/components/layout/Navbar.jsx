import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import logo from "../../assets/logo-tkr.png";

const MAIN_LINKS = [
  { to: "/", key: "home" },
  { to: "/a-propos", key: "about" },
  { to: "/activites", key: "services" },
  { to: "/realisations", key: "projects" },
];

// Ordonné par priorité commerciale : offres immobilières et commerciales
// d'abord, recrutement ensuite, informations légales en dernier.
const MORE_LINKS = [
  { to: "/location-maisons", labelKey: "more.rentals" },
  { to: "/vente-terrains", labelKey: "more.land" },
  { to: "/commerce-general", labelKey: "more.commerce" },
  { to: "/blog", labelKey: "more.blog" },
  { to: "/carrieres", labelKey: "more.jobs" },
  { to: "/mentions-legales", labelKey: "more.legal" },
];

export default function Navbar() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function closeAll() {
    setOpen(false);
    setMoreOpen(false);
    setMobileMoreOpen(false);
  }

  return (
    <header className="navbar">
      <nav className="navbar-inner wrap">
        <Link to="/" className="brand" onClick={closeAll} aria-label="Groupe TKR — Accueil">
          <img src={logo} alt="Groupe TKR" className="brand-mark" />
          <div className="brand-text">
            <div className="name">GROUPE TKR</div>
            <div className="tag">{lang === "fr" ? "LE TGV DE LA CONSTRUCTION" : "THE CONSTRUCTION TGV"}</div>
          </div>
        </Link>

        <div className={`nav-links ${open ? "open" : ""}`}>
          {MAIN_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={closeAll} className={({ isActive }) => (isActive ? "active" : "")}>
              {t(`nav.${l.key}`)}
            </NavLink>
          ))}

          {/* Dropdown desktop */}
          <div className="dropdown" ref={dropdownRef}>
            <button
              type="button"
              className={`dropdown-trigger ${moreOpen ? "active" : ""}`}
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              {t("nav.more")} <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {moreOpen && (
              <div className="dropdown-menu">
                {MORE_LINKS.map((l) => (
                  <NavLink key={l.to} to={l.to} onClick={closeAll} className={({ isActive }) => (isActive ? "active" : "")}>
                    {t(l.labelKey)}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Accordéon mobile pour les mêmes liens */}
          <div className="mobile-more">
            <button type="button" className="dropdown-trigger" onClick={() => setMobileMoreOpen((v) => !v)} aria-expanded={mobileMoreOpen}>
              {t("nav.more")} <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: mobileMoreOpen ? "rotate(180deg)" : "none" }}><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {mobileMoreOpen && (
              <div className="mobile-more-list">
                {MORE_LINKS.map((l) => (
                  <NavLink key={l.to} to={l.to} onClick={closeAll} className={({ isActive }) => (isActive ? "active" : "")}>
                    {t(l.labelKey)}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Le bouton "Nous contacter" de l'en-tête est masqué sur mobile
              (place limitée à côté du burger) : on le republie ici, dans le
              panneau du menu, pour que Contact reste atteignable au clavier
              tactile depuis n'importe quelle page. */}
          <button type="button" className="mobile-cta" onClick={() => { closeAll(); navigate("/contact"); }}>
            {t("nav.cta")}
          </button>
        </div>

        <div className="nav-right">
          <div className="lang">
            <button type="button" className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
            <span>/</span>
            <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
          <button type="button" className="cta" onClick={() => navigate("/contact")}>{t("nav.cta")}</button>
          <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <style>{`
        .navbar{position:sticky; top:0; z-index:40; background:rgba(237,232,224,.94); backdrop-filter:blur(8px); border-bottom:1px solid var(--line);}
        .navbar-inner{display:flex; align-items:center; justify-content:space-between; padding:12px 32px;}
        .brand{display:flex; align-items:center; gap:12px;}
        .brand-mark{height:44px; width:auto; display:block;}
        .brand-text .name{font-family:'Oswald'; font-weight:700; font-size:17px; letter-spacing:.03em; color:var(--maroon);}
        .brand-text .tag{font-family:'IBM Plex Mono'; font-size:9px; letter-spacing:.06em; color:var(--ink);}
        .nav-links{display:flex; gap:26px; align-items:center;}
        .nav-links > a{font-size:14px; font-weight:500; color:var(--ink); position:relative; padding:4px 0;}
        .nav-links > a::after{content:""; position:absolute; left:0; bottom:-2px; width:0; height:2px; background:var(--maroon); transition:width .25s ease;}
        .nav-links > a:hover::after, .nav-links > a.active::after{width:100%;}
        .nav-links > a.active{color:var(--maroon);}

        .dropdown{position:relative;}
        .dropdown-trigger{display:flex; align-items:center; gap:6px; background:none; border:none; font-size:14px; font-weight:500; color:var(--ink); font-family:inherit; padding:4px 0;}
        .dropdown-trigger.active{color:var(--maroon);}
        .dropdown-menu{position:absolute; top:calc(100% + 14px); left:0; background:var(--paper); border:1px solid var(--line); min-width:220px; box-shadow:0 12px 24px rgba(0,0,0,.12); z-index:50;}
        .dropdown-menu a{display:block; padding:11px 16px; font-size:13.5px; color:var(--ink); border-bottom:1px solid var(--line);}
        .dropdown-menu a:last-child{border-bottom:none;}
        .dropdown-menu a:hover{background:var(--concrete); color:var(--maroon);}
        .dropdown-menu a.active{color:var(--maroon); font-weight:600;}

        .mobile-more{display:none;}
        .mobile-cta{display:none;}

        .nav-right{display:flex; align-items:center; gap:16px;}
        .lang{font-family:'IBM Plex Mono'; font-size:12px; border:1px solid var(--line-strong); border-radius:20px; padding:5px 12px; display:flex; gap:6px;}
        .lang button{background:none; border:none; font-family:inherit; font-size:12px; opacity:.45; padding:0;}
        .lang button.active{opacity:1; font-weight:600; color:var(--maroon);}
        .cta{background:var(--maroon); color:var(--paper); padding:9px 18px; font-size:13px; font-weight:600; border-radius:2px; border:none; font-family:inherit;}
        .cta:hover{background:var(--maroon-dark);}
        .burger{display:none; flex-direction:column; gap:4px; background:none; border:none;}
        .burger span{width:22px; height:2px; background:var(--ink); display:block;}
        @media (max-width:900px){
          .nav-links{display:none; position:absolute; top:100%; left:0; right:0; background:var(--paper); flex-direction:column; align-items:stretch; padding:12px 20px 24px; border-bottom:1px solid var(--line); gap:2px; max-height:85vh; overflow-y:auto;}
          .nav-links.open{display:flex;}
          .nav-links > a{padding:13px 4px; min-height:44px; display:flex; align-items:center; box-sizing:border-box;}
          .burger{display:flex; padding:14px 11px; margin:-14px -11px; box-sizing:content-box;}
          .cta{display:none;}
          .dropdown{display:none;}
          .mobile-more{display:block; width:100%;}
          .mobile-more .dropdown-trigger{width:100%; justify-content:space-between; padding:13px 4px; min-height:44px; box-sizing:border-box;}
          .mobile-more-list{display:flex; flex-direction:column; gap:2px; padding:2px 0 6px 12px;}
          .mobile-more-list a{font-size:13.5px; color:#544D45; padding:10px 4px; min-height:40px; display:flex; align-items:center; box-sizing:border-box;}
          .mobile-more-list a.active{color:var(--maroon); font-weight:600;}
          .mobile-cta{display:block; width:100%; margin-top:14px; background:var(--maroon); color:var(--paper); padding:13px 18px; min-height:46px; font-size:14px; font-weight:600; border-radius:2px; border:none; font-family:inherit;}
          .lang{padding:2px;}
          .lang button{padding:9px 12px; min-height:40px; min-width:40px;}
        }
      `}</style>
    </header>
  );
}
