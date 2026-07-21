import { Client, Account, Databases } from "appwrite";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || "";

// True once the Groupe TKR Appwrite project has been created and its ID
// added to .env.local — until then, the site runs entirely on the
// provisional local content in src/data/seed/*.json.
export const isAppwriteConfigured = Boolean(PROJECT_ID);

const client = new Client();
if (isAppwriteConfigured) {
  client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);
}

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "tkr_main";

export const COLLECTIONS = {
  branches: import.meta.env.VITE_COL_BRANCHES || "branches",
  values: import.meta.env.VITE_COL_VALUES || "values",
  services: import.meta.env.VITE_COL_SERVICES || "services",
  projects: import.meta.env.VITE_COL_PROJECTS || "projects",
  team: import.meta.env.VITE_COL_TEAM || "team",
  testimonials: import.meta.env.VITE_COL_TESTIMONIALS || "testimonials",
  jobs: import.meta.env.VITE_COL_JOBS || "jobs",
  events: import.meta.env.VITE_COL_EVENTS || "events",
  blog: import.meta.env.VITE_COL_BLOG || "blog",
};

export default client;
