// Les champs "images" sont saisis dans le back-office comme une URL par
// ligne (ou séparées par des virgules). Cette fonction les transforme en
// tableau, en respectant un nombre maximum d'images.
// Les champs "images" sont soit un vrai tableau (attribut Appwrite de type
// URL en mode "array"), soit — en mode démonstration, avant qu'Appwrite ne
// soit branché — une chaîne avec une URL par ligne dans src/data/seed/*.json.
export function parseImages(raw, max = 10) {
  if (!raw) return [];
  const list = Array.isArray(raw)
    ? raw.map((s) => String(s).trim()).filter(Boolean)
    : String(raw).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  return max ? list.slice(0, max) : list;
}
