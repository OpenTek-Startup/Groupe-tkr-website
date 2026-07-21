import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/AuthContext";
import { ADMIN_COLLECTIONS } from "./adminCollectionsConfig";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">GROUPE TKR<span>Back-office</span></div>
        <nav>
          <NavLink to="/admin" end>Tableau de bord</NavLink>
          {ADMIN_COLLECTIONS.map((c) => (
            <NavLink key={c.key} to={`/admin/collections/${c.key}`}>{c.label}</NavLink>
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
        .admin-brand{font-family:'Oswald'; color:var(--paper); font-size:16px; letter-spacing:.03em; margin-bottom:26px;}
        .admin-brand span{display:block; font-family:'IBM Plex Mono'; font-size:10px; color:var(--amber); text-transform:uppercase; margin-top:4px;}
        .admin-sidebar nav{display:flex; flex-direction:column; gap:4px; flex:1;}
        .admin-sidebar nav a{padding:9px 10px; font-size:13.5px; border-radius:3px; color:#C4BCAD;}
        .admin-sidebar nav a:hover{background:rgba(248,245,239,.08); color:var(--paper);}
        .admin-sidebar nav a.active{background:var(--maroon); color:var(--paper);}
        .admin-user{border-top:1px solid rgba(248,245,239,.15); padding-top:16px;}
        .admin-content{padding:36px 42px;}
        @media (max-width:800px){ .admin-shell{grid-template-columns:1fr;} .admin-sidebar{position:sticky; top:0; z-index:10;} }
      `}</style>
    </div>
  );
}
