import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useI18n } from "../../i18n/I18nContext";
import { ADMIN_COLLECTIONS } from "./adminCollectionsConfig";
import logoLight from "../../assets/logo-tkr-light.png";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { lang, setLang } = useI18n();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell">
      <button
        type="button"
        className="admin-burger"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={mobileOpen}
      >
        <span className="logo-badge"><img src={logoLight} alt="" /></span>
        <span className="admin-burger-label">GROUPE TKR <em>Back-office</em></span>
        <span className={`admin-burger-icon ${mobileOpen ? "open" : ""}`}><span /><span /><span /></span>
      </button>

      <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <span className="logo-badge"><img src={logoLight} alt="Groupe TKR" /></span>
          <div>GROUPE TKR<span>Back-office</span></div>
        </div>
        <div className="admin-lang">
          <span className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</span>
          <span>/</span>
          <span className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</span>
        </div>
        <nav>
          <NavLink to="/admin" end onClick={() => setMobileOpen(false)}>Tableau de bord</NavLink>
          {ADMIN_COLLECTIONS.map((c) => (
            <Fragment key={c.key}>
              <NavLink to={`/admin/collections/${c.key}`} onClick={() => setMobileOpen(false)}>{c.label}</NavLink>
              {c.key === "jobs" && (
                <NavLink to="/admin/applications" className="highlight-link" onClick={() => setMobileOpen(false)}>Candidatures</NavLink>
              )}
            </Fragment>
          ))}
        </nav>
        <div className="admin-user">
          {user && <div className="mono" style={{ fontSize: 12, marginBottom: 10 }}>{user.email}</div>}
          <button className="btn-ghost" onClick={handleLogout} style={{ width: "100%" }}>Se déconnecter</button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>

      <style>{`
        .admin-shell{display:grid; grid-template-columns:240px 1fr; min-height:100vh; background:var(--concrete);}
        .admin-burger{display:none;}
        .admin-sidebar{background:var(--charcoal); color:var(--concrete); padding:24px 18px; display:flex; flex-direction:column;}
        .admin-brand{display:flex; align-items:center; gap:10px; margin-bottom:18px;}
        .admin-brand .logo-badge, .admin-burger .logo-badge{width:36px; height:36px; flex:none; background:#fff; border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden; padding:2px;}
        .admin-brand .logo-badge img, .admin-burger .logo-badge img{width:100%; height:100%; object-fit:contain;}
        .admin-brand div{font-family:'Oswald'; color:var(--paper); font-size:15px; letter-spacing:.03em; line-height:1.2;}
        .admin-brand span{display:block; font-family:'IBM Plex Mono'; font-size:10px; color:var(--amber); text-transform:uppercase; margin-top:2px;}
        .admin-lang{font-family:'IBM Plex Mono'; font-size:11px; display:flex; gap:6px; margin-bottom:22px; cursor:pointer;}
        .admin-lang span{opacity:.5;}
        .admin-lang span.active{opacity:1; font-weight:600; color:var(--amber);}
        .admin-sidebar nav{display:flex; flex-direction:column; gap:4px; flex:1;}
        .admin-sidebar nav a{padding:9px 10px; font-size:13.5px; border-radius:3px; color:#C4BCAD;}
        .admin-sidebar nav a:hover{background:rgba(248,245,239,.08); color:var(--paper);}
        .admin-sidebar nav a.active{background:var(--maroon); color:var(--paper);}
        .admin-sidebar nav a.highlight-link{color:var(--amber); font-weight:600; padding-left:20px;}
        .admin-sidebar nav a.highlight-link.active{color:var(--paper);}
        .admin-user{border-top:1px solid rgba(248,245,239,.15); padding-top:16px;}
        .admin-content{padding:36px 42px;}
        @media (max-width:640px){ .admin-content{padding:24px 18px;} }
        @media (max-width:800px){
          .admin-shell{grid-template-columns:1fr; grid-template-rows:auto auto 1fr;}
          .admin-burger{
            display:flex; align-items:center; gap:10px; width:100%; background:var(--charcoal); color:var(--paper);
            border:none; font-family:inherit; padding:12px 18px; position:sticky; top:0; z-index:20; text-align:left;
          }
          .admin-burger-label{font-family:'Oswald'; font-size:14px; letter-spacing:.02em; flex:1;}
          .admin-burger-label em{display:block; font-family:'IBM Plex Mono'; font-style:normal; font-size:9px; color:var(--amber); text-transform:uppercase; margin-top:1px;}
          .admin-burger-icon{display:flex; flex-direction:column; gap:4px; padding:14px 6px; margin:-14px -6px;}
          .admin-burger-icon span{width:20px; height:2px; background:var(--paper); display:block; transition:transform .2s ease, opacity .2s ease;}
          .admin-burger-icon.open span:nth-child(1){transform:translateY(6px) rotate(45deg);}
          .admin-burger-icon.open span:nth-child(2){opacity:0;}
          .admin-burger-icon.open span:nth-child(3){transform:translateY(-6px) rotate(-45deg);}

          .admin-sidebar{display:none; position:static;}
          .admin-sidebar.open{display:flex;}
          .admin-sidebar .admin-brand{display:none;}
        }
      `}</style>
    </div>
  );
}
