"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "maybetours:saved";
const CHANGE_EVENT = "maybetours:saved-change";

function readStorage(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(slugs: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // ignore (private browsing, storage disabled, etc.)
  }
}

/** Per-visitor saved-tours list, persisted to localStorage and synced live across components on the page. */
export function useFavorites() {
  const [saved, setSaved] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from localStorage, not derived state
    setSaved(readStorage());
    setHydrated(true);
    const sync = () => setSaved(readStorage());
    window.addEventListener("storage", sync);
    window.addEventListener(CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(CHANGE_EVENT, sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = readStorage();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    writeStorage(next);
    setSaved(next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  const isSaved = useCallback((slug: string) => saved.includes(slug), [saved]);

  return { saved, hydrated, toggle, isSaved };
}
