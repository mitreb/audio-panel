import { useState, useEffect } from 'react';

type View = 'table' | 'grid';

export function useViewPreference(
  storageKey: string,
  defaultView: View = 'table'
) {
  const [view, setView] = useState<View>(() => {
    const saved = localStorage.getItem(storageKey);
    return (saved as View) || defaultView;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, view);
  }, [view, storageKey]);

  return [view, setView] as const;
}
