import { create } from "zustand";

// create a zustand store for the theme
//zustand is a state management library for react
export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("nomify-theme") || "synthwave",
  setTheme: (theme) => {
    localStorage.setItem("nomify-theme", theme);
    set({ theme });
  },
}));
