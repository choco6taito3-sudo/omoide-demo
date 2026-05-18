"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type BackgroundType = "none" | "balloons" | "sparkles" | "flowers";

const STORAGE_KEY = "omoide_background";

type BackgroundContextType = {
  background: BackgroundType;
  setBackground: (bg: BackgroundType) => void;
};

const BackgroundContext = createContext<BackgroundContextType>({
  background: "none",
  setBackground: () => {},
});

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [background, setBackgroundState] = useState<BackgroundType>("none");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as BackgroundType | null;
    if (saved) setBackgroundState(saved);
  }, []);

  function setBackground(bg: BackgroundType) {
    setBackgroundState(bg);
    localStorage.setItem(STORAGE_KEY, bg);
  }

  return (
    <BackgroundContext.Provider value={{ background, setBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  return useContext(BackgroundContext);
}
