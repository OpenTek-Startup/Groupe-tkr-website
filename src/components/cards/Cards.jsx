import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";
import { parseImages } from "../../lib/images";
import { relationId } from "../../lib/relations";

const COLORS = { amber: "#DE9F3C", brick: "#C4536F", teal: "#4FA391", indigo: "#8377D6", slate: "#5C7A8A" };

export function BranchCard({ branch }) {
  const { field, t } = useI18n();
  const color = COLORS[branch.color] || "#DE9F3C";
  const href = branch.link || `/activites#${branch.$id}`;
  return (
    <div className="branch-card">
      <span className="accent-line" style={{ background: color }} />
      <span className="code" style={{ color }}>{branch.code} / {field(branch, "name")}</span>
      <h3>{field(branch, "title")}</h3>
      <p>{field(branch, "description")}</p>
      <Link to={href} className="more" style={{ color }}>{t("services.more")} →</Link>
      <style>{`
        .branch-card{background:#242019; border:1px solid rgba(248,245,239,.1); padding:32px; position:relative; color:var(--paper); transition:transform .25s ease, border-color .25s ease;}
        .branch-card:hover{transform:translateY(-4px); border-color:rgba(248,245,239,.28);}
        .branch-card .accent-line{position:absolute; top:0; left:0; right:0; height:3px;}
        .branch-card .code{font-family:'IBM Plex Mono'; font-size:11.5px; letter-spacing:.08em; margin-bottom:18px; display:block; text-transform:uppercase;}
        .branch-card h3{font-size:20px; color:var(--paper); margin-bottom:12px;}
        .branch-card p{font-size:14px; color:#C4BCAD; margin-bottom:18px; max-width:44ch;}
        .branch-card .more{font-family:'IBM Plex Mono'; font-size:12px;}
      `}</style>
    </div>
  );
}

export function ValueCard({ value, index }) {
  const { field } = useI18n();
  return (
    <div className="value-card">
      <div className="num">{String(index + 1).padStart(2, "0")}</div>
      <h4>{field(value, "title")}</h4>
      <p>{field(value, "description")}</p>
      <style>{`
        .value-card{background:var(--paper); border:1px solid var(--line); padding:28px 22px;}
        .value-card .num{font-family:'IBM Plex Mono'; color:var(--maroon); font-size:13px; margin-bottom:14px;}
        .value-card h4{font-size:16px; margin-bottom:8px;}
        .value-card p{font-size:13.5px; color:#544D45;}
      `}</style>
    </div>
  );
}

export function ProjectCard({ project }) {
  const { field } = useI18n();
  const branchId = relationId(project.branch);
  const branchColor = { btp: "#DE9F3C", immobilier: "#C4536F", aquaculture: "#4FA391", opentek: "#8377D6" }[branchId] || "#DE9F3C";
  return (
    <div className="proj-card">
      <div className="proj-thumb" style={{ background: `linear-gradient(160deg, ${branchColor}, #2a2419)` }}>
        <span className="tag">{branchId}</span>
      </div>
      <div className="proj-body">
        <h4>{field(project, "title")}</h4>
        <p>{field(project, "description")}</p>
        <div className="loc">{field(project, "location")}</div>
      </div>
      <style>{`
        .proj-card{background:var(--paper); border:1px solid var(--line);}
        .proj-thumb{aspect-ratio:4/3; position:relative;}
        .proj-thumb .tag{position:absolute; top:12px; left:12px; font-family:'IBM Plex Mono'; font-size:10px; text-transform:uppercase; padding:4px 9px; color:#fff; background:#00000055;}
        .proj-body{padding:16px 16px 20px;}
        .proj-body h4{font-size:15px; margin-bottom:6px;}
        .proj-body p{font-size:12.5px; color:#5b544c;}
        .proj-body .loc{font-family:'IBM Plex Mono'; font-size:10.5px; color:#8b8377; margin-top:10px; text-transform:uppercase;}
      `}</style>
    </div>
  );
}

export function TestimonialCard({ item }) {
  const { field } = useI18n();
  const initials = (item.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <div className="testi-card">
      <span className="quote-mark">"</span>
      <p className="quote">{field(item, "quote")}</p>
      <div className="testi-who">
        <div className="testi-avatar">{initials}</div>
        <div>
          <div className="name">{item.name}</div>
          <div className="role">{field(item, "role")}</div>
        </div>
      </div>
      <style>{`
        .testi-card{background:var(--paper); border:1px solid var(--line); padding:30px; position:relative;}
        .testi-card .quote-mark{font-family:'Oswald'; font-size:48px; color:var(--concrete-dark); line-height:1; position:absolute; top:14px; right:20px;}
        .testi-card p.quote{font-size:15px; color:#3a352f; margin-bottom:20px; position:relative; z-index:1; max-width:48ch;}
        .testi-who{display:flex; align-items:center; gap:12px;}
        .testi-avatar{width:38px; height:38px; border-radius:50%; background:var(--maroon); color:#fff; display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono'; font-size:12px;}
        .testi-who .name{font-weight:600; font-size:13.5px;}
        .testi-who .role{font-size:12px; color:#7a7268;}
      `}</style>
    </div>
  );
}

export function TeamCard({ member }) {
  const { field } = useI18n();
  const initials = (member.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <div className="team-card">
      <div className="avatar">{initials}</div>
      <h4>{member.name}</h4>
      <div className="role">{field(member, "role")}</div>
      <p>{field(member, "bio")}</p>
      <style>{`
        .team-card{background:var(--paper); border:1px solid var(--line); padding:26px; text-align:center;}
        .team-card .avatar{width:56px; height:56px; border-radius:50%; background:var(--charcoal); color:var(--amber); font-family:'IBM Plex Mono'; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; font-size:16px;}
        .team-card h4{font-size:15px; margin-bottom:4px;}
        .team-card .role{font-family:'IBM Plex Mono'; font-size:11px; color:var(--maroon); margin-bottom:12px; text-transform:uppercase;}
        .team-card p{font-size:13px; color:#544D45;}
      `}</style>
    </div>
  );
}

export function RentalCard({ item, onOpen }) {
  const { field, t } = useI18n();
  const cover = parseImages(item.images, 1)[0];
  return (
    <div className="listing-card">
      <div
        className="listing-thumb"
        style={cover ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: "linear-gradient(160deg, #C4536F, #2a2419)" }}
      />
      <div className="listing-body">
        <h4>{field(item, "title")}</h4>
        <p className="loc">{field(item, "location")}</p>
        <p>{field(item, "description")}</p>
        <div className="listing-meta">
          <span>{item.rooms ? `${item.rooms} pièces` : ""}</span>
          <span className="price">{field(item, "price")}</span>
        </div>
        <button className="btn-ghost listing-more" onClick={() => onOpen(item)}>{t("listing.more")}</button>
      </div>
      <style>{`
        .listing-card{background:var(--paper); border:1px solid var(--line);}
        .listing-thumb{aspect-ratio:16/10;}
        .listing-body{padding:18px 18px 20px;}
        .listing-body h4{font-size:16px; margin-bottom:6px;}
        .listing-body .loc{font-family:'IBM Plex Mono'; font-size:10.5px; color:#8b8377; text-transform:uppercase; margin-bottom:10px;}
        .listing-body p{font-size:13.5px; color:#544D45;}
        .listing-meta{display:flex; justify-content:space-between; margin-top:14px; padding-top:14px; border-top:1px solid var(--line); font-size:13px;}
        .listing-meta .price{font-weight:600; color:var(--maroon);}
        .listing-more{width:100%; margin-top:16px;}
      `}</style>
    </div>
  );
}

export function LandCard({ item, onOpen }) {
  const { field, t } = useI18n();
  const cover = parseImages(item.images, 1)[0];
  return (
    <div className="listing-card">
      <div
        className="listing-thumb"
        style={cover ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: "linear-gradient(160deg, #DE9F3C, #2a2419)" }}
      />
      <div className="listing-body">
        <h4>{field(item, "title")}</h4>
        <p className="loc">{field(item, "location")}</p>
        <p>{field(item, "description")}</p>
        <div className="listing-meta">
          <span>{item.surface}</span>
          <span className="price">{field(item, "price")}</span>
        </div>
        <button className="btn-ghost listing-more" onClick={() => onOpen(item)}>{t("listing.more")}</button>
      </div>
      <style>{`
        .listing-card{background:var(--paper); border:1px solid var(--line);}
        .listing-thumb{aspect-ratio:16/10;}
        .listing-body{padding:18px 18px 20px;}
        .listing-body h4{font-size:16px; margin-bottom:6px;}
        .listing-body .loc{font-family:'IBM Plex Mono'; font-size:10.5px; color:#8b8377; text-transform:uppercase; margin-bottom:10px;}
        .listing-body p{font-size:13.5px; color:#544D45;}
        .listing-meta{display:flex; justify-content:space-between; margin-top:14px; padding-top:14px; border-top:1px solid var(--line); font-size:13px;}
        .listing-meta .price{font-weight:600; color:var(--maroon);}
        .listing-more{width:100%; margin-top:16px;}
      `}</style>
    </div>
  );
}

export function CommerceCard({ item }) {
  const { field } = useI18n();
  const images = parseImages(item.images, 3);
  return (
    <div className="card commerce-card">
      {images.length > 0 ? (
        <div className="commerce-thumbs">
          {images.map((src, i) => <img key={i} src={src} alt="" />)}
        </div>
      ) : (
        <div className="commerce-thumbs placeholder">
          {[0, 1, 2].map((i) => (
            <div key={i} className="commerce-thumb-placeholder" style={{ background: "linear-gradient(160deg, #5C7A8A, #2a2419)" }} />
          ))}
        </div>
      )}
      <div style={{ padding: 20 }}>
        <h4 style={{ fontSize: 15.5, marginBottom: 8, fontFamily: "Oswald", textTransform: "uppercase" }}>{field(item, "title")}</h4>
        <p style={{ fontSize: 13.5, color: "#544D45" }}>{field(item, "description")}</p>
      </div>
      <style>{`
        .commerce-card{padding:0; overflow:hidden;}
        .commerce-thumbs{display:grid; grid-template-columns:repeat(3,1fr); gap:2px;}
        .commerce-thumbs img{width:100%; aspect-ratio:1; object-fit:cover; display:block;}
        .commerce-thumb-placeholder{width:100%; aspect-ratio:1;}
      `}</style>
    </div>
  );
}

export function JobCard({ job, onApply }) {
  const { field, t } = useI18n();
  return (
    <div className="job-card">
      <div>
        <span className="tag-pill" style={{ background: "var(--concrete-dark)", color: "var(--ink)" }}>{field(job, "type")}</span>
        <h4>{field(job, "title")}</h4>
        <p className="loc">{field(job, "location")}</p>
        <p>{field(job, "description")}</p>
      </div>
      <button className="btn-ghost" onClick={() => onApply(field(job, "title"))}>{t("jobs.apply")}</button>
      <style>{`
        .job-card{background:var(--paper); border:1px solid var(--line); padding:26px; display:flex; flex-direction:column; justify-content:space-between; gap:18px;}
        .job-card h4{font-size:17px; margin:12px 0 4px;}
        .job-card .loc{font-family:'IBM Plex Mono'; font-size:11px; color:#8b8377; margin-bottom:10px; text-transform:uppercase;}
        .job-card p{font-size:13.5px; color:#544D45;}
      `}</style>
    </div>
  );
}

export function EventCard({ event }) {
  const { field } = useI18n();
  const d = new Date(event.date);
  return (
    <div className="event-card">
      <div className="date">
        <div className="day">{d.getDate()}</div>
        <div className="month">{d.toLocaleDateString(undefined, { month: "short", year: "numeric" })}</div>
      </div>
      <div>
        <h4>{field(event, "title")}</h4>
        <p className="loc">{field(event, "location")}</p>
        <p>{field(event, "description")}</p>
      </div>
      <style>{`
        .event-card{background:var(--paper); border:1px solid var(--line); padding:24px; display:grid; grid-template-columns:80px 1fr; gap:20px; align-items:start;}
        .event-card .date{background:var(--charcoal); color:var(--paper); text-align:center; padding:12px 6px;}
        .event-card .day{font-family:'Oswald'; font-size:24px; line-height:1;}
        .event-card .month{font-family:'IBM Plex Mono'; font-size:10px; text-transform:uppercase; margin-top:4px;}
        .event-card h4{font-size:16px; margin-bottom:4px;}
        .event-card .loc{font-family:'IBM Plex Mono'; font-size:11px; color:#8b8377; margin-bottom:8px; text-transform:uppercase;}
        .event-card p{font-size:13.5px; color:#544D45;}
      `}</style>
    </div>
  );
}

export function BlogCard({ post }) {
  const { field, t } = useI18n();
  const d = new Date(post.date);
  return (
    <div className="blog-card">
      <div className="meta mono">{d.toLocaleDateString()} — {post.author}</div>
      <h4>{field(post, "title")}</h4>
      <p>{field(post, "excerpt")}</p>
      <Link to={`/blog/${post.$id}`} className="more">{t("blog.readMore")} →</Link>
      <style>{`
        .blog-card{background:var(--paper); border:1px solid var(--line); padding:26px;}
        .blog-card .meta{font-size:11px; color:#8b8377; margin-bottom:10px;}
        .blog-card h4{font-size:17px; margin-bottom:8px;}
        .blog-card p{font-size:13.5px; color:#544D45; margin-bottom:14px;}
        .blog-card .more{font-family:'IBM Plex Mono'; font-size:12px; color:var(--maroon);}
      `}</style>
    </div>
  );
}
