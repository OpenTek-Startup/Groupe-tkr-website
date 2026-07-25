import { useEffect, useState } from "react";
import { getItem } from "../services/dataService";
import { SETTINGS_DOC_ID } from "../lib/appwrite";

export function useSettings() {
  const [state, setState] = useState({ settings: null, source: "provisoire", loading: true });

  useEffect(() => {
    let mounted = true;
    getItem("settings", SETTINGS_DOC_ID).then(({ item, source }) => {
      if (mounted) setState({ settings: item, source, loading: false });
    });
    return () => { mounted = false; };
  }, []);

  return state;
}
