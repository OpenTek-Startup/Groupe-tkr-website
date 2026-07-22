import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router ne fait pas défiler la page vers l'ancre (#id) lors d'une
 * navigation entre deux routes différentes (seulement lors d'un simple clic
 * sur un lien de la même page). Ce composant reproduit ce comportement.
 */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Laisse le temps au DOM de la nouvelle page de se rendre avant de
      // chercher l'élément cible.
      const id = hash.replace("#", "");
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash]);

  return null;
}
