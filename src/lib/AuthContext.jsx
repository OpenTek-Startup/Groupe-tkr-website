import { createContext, useContext, useEffect, useState } from "react";
import { account, isAppwriteConfigured } from "./appwrite";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAppwriteConfigured) { setLoading(false); return; }
    account.get()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    await account.createEmailPasswordSession(email, password);
    const u = await account.get();
    setUser(u);
    return u;
  }

  async function logout() {
    await account.deleteSession("current");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAppwriteConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
