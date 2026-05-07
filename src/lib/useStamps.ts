"use client";

import { useState, useEffect, useCallback } from "react";

function storageKey(slug: string) {
  return `spe_stamps_${slug}`;
}

export function useStamps(slug: string, required: number) {
  const [stamps, setStamps] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(storageKey(slug)) ?? "0", 10);
    setStamps(isNaN(stored) ? 0 : stored);
  }, [slug]);

  const addStamp = useCallback(() => {
    setStamps((prev) => {
      const next = prev >= required ? 1 : prev + 1;
      localStorage.setItem(storageKey(slug), String(next));
      return next;
    });
  }, [slug, required]);

  const claimReward = useCallback(() => {
    localStorage.setItem(storageKey(slug), "0");
    setStamps(0);
  }, [slug]);

  return { stamps, addStamp, claimReward };
}
