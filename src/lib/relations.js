// Une fois qu'un champ est un vrai attribut Relationship Appwrite, l'API
// renvoie le document lié complet (ex : { $id: "btp", title_fr: "...", ... })
// au lieu d'une simple chaîne. En mode démonstration (contenu provisoire de
// src/data/seed), ce même champ reste une chaîne toute simple ("btp").
// Cette fonction gère les deux cas pour que le reste du code n'ait jamais à
// se poser la question.
export function relationId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ? relationId(value[0]) : null;
  if (typeof value === "object") return value.$id || null;
  return null;
}
