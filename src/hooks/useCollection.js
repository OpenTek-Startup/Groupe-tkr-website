import { useEffect, useState } from "react";
import { listItems } from "../services/dataService";

export function useCollection(collectionKey, queries = []) {
  const [state, setState] = useState({ items: [], source: "provisoire", loading: true });

  useEffect(() => {
    let mounted = true;
    setState((s) => ({ ...s, loading: true }));
    listItems(collectionKey, queries).then(({ items, source }) => {
      if (mounted) setState({ items, source, loading: false });
    });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionKey]);

  return state;
}
