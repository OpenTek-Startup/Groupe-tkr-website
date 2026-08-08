import { createContext, useContext, useEffect, useState } from "react";
import { account, isAppwriteConfigured } from "./appwrite";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    if (!isAppwriteConfigured) return null;
    try {
      const u = await account.get();
      setUser(u);
      return u;
    } catch {
      setUser(null);
      return null;
    }
  }

  useEffect(() => {
    if (!isAppwriteConfigured) { setLoading(false); return; }
    refreshUser().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
    } catch (err) {
      if (/session is active|session is prohibited/i.test(err.message || "")) {
        // Une session valide existe déjà pour ce navigateur (ex : connexion
        // réussie plus tôt, `account.get()` momentanément en échec au
        // chargement) — on la récupère au lieu d'échouer bêtement.
        const existing = await refreshUser();
        if (existing) return existing;
      }
      throw err;
    }
    return refreshUser();
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
  }

  // --- Récupération de mot de passe -----------------------------------
  // 1) requestPasswordRecovery envoie un email contenant un lien vers
  //    /admin/reset-password?userId=...&secret=...
  // 2) completePasswordRecovery utilise ce userId+secret pour définir le
  //    nouveau mot de passe. Le secret n'est valide qu'une heure et une
  //    seule fois (comportement Appwrite).
  async function requestPasswordRecovery(email) {
    if (!isAppwriteConfigured) throw new Error("Appwrite n'est pas encore configuré.");
    const resetUrl = `${window.location.origin}/admin/reset-password`;
    await account.createRecovery(email, resetUrl);
  }

  async function completePasswordRecovery(userId, secret, password) {
    if (!isAppwriteConfigured) throw new Error("Appwrite n'est pas encore configuré.");
    await account.updateRecovery(userId, secret, password);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, requestPasswordRecovery, completePasswordRecovery, isAppwriteConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
