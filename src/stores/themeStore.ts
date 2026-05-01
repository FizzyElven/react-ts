import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
    isDark: boolean;
    toggle: () => void;
}

export const useTheme = create<ThemeStore>()(
    persist(
        (set) => ({
            isDark: false, // Default
            toggle: () => set((state) => {
                const newState = !state.isDark;
                // The one-liner to toggle the class for Tailwind v4
                document.documentElement.classList.toggle('dark', newState);
                return { isDark: newState };
            }),
        }),
        { name: 'theme-storage' }
    )
);