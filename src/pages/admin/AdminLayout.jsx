import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useI18n } from "../../i18n/I18nContext";
import { ADMIN_COLLECTIONS } from "./adminCollectionsConfig";
import logoLight from "../../assets/logo-tkr-light.png";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { lang, setLang } = useI18n();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
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
          <NavLink to="/admin" end>Tableau de bord</NavLink>
          {ADMIN_COLLECTIONS.map((c) => (
            <Fragment key={c.key}>
              <NavLink to={`/admin/collections/${c.key}`}>{c.label}</NavLink>
              {c.key === "jobs" && (
                <NavLink to="/admin/applications" className="highlight-link">Candidatures</NavLink>
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
        .admin-sidebar{background:var(--charcoal); color:var(--concrete); padding:24px 18px; display:flex; flex-direction:column;}
        .admin-brand{display:flex; align-items:center; gap:10px; margin-bottom:18px;}
        .admin-brand .logo-badge{width:36px; height:36px; flex:none; background:#fff; border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden; padding:2px;}
        .admin-brand .logo-badge img{width:100%; height:100%; object-fit:contain;}
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
        @media (max-width:800px){ .admin-shell{grid-template-columns:1fr;} .admin-sidebar{position:sticky; top:0; z-index:10;} }
      `}</style>
    </div>
  );
}
