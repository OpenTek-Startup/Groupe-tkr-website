// Filet de sécurité pour les formulaires publics (contact, newsletter)
// lorsque Appwrite n'est pas encore configuré : rien n'est perdu, les
// soumissions sont conservées dans le navigateur en attendant la mise en
// service du back-end. Une fois Appwrite branché, les nouvelles soumissions
// y sont enregistrées directement (voir services/dataService.js).

const PREFIX = "tkr_fallback_";

export function saveLocalFallback(key, entry) {
  try {
    const storageKey = PREFIX + key;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    existing.push({ ...entry, _savedAt: new Date().toISOString() });
    localStorage.setItem(storageKey, JSON.stringify(existing));
  } catch {
    // Stockage indisponible (navigation privée, quota…) — on ignore
    // silencieusement plutôt que de casser l'expérience utilisateur.
  }
}

export function readLocalFallback(key) {
  try {
    return JSON.parse(localStorage.getItem(PREFIX + key) || "[]");
  } catch {
    return [];
  }
}
