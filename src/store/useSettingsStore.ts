/**
 * 設定ストア（Zustand）
 */
import { create } from 'zustand';
import type { Settings } from '../types';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage';

interface SettingsStore {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  toggleDarkMode: () => void;
  setFirstTime: (value: boolean) => void;
}

const defaultSettings: Settings = {
  monthlyBudget: 30000,
  darkMode: false,
  notifications: true,
  firstTime: true,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: getFromStorage(STORAGE_KEYS.SETTINGS, defaultSettings),

  updateSettings: (updates) =>
    set((state) => {
      const newSettings = { ...state.settings, ...updates };
      saveToStorage(STORAGE_KEYS.SETTINGS, newSettings);

      // ダークモードの適用
      if ('darkMode' in updates) {
        document.body.classList.toggle('dark-mode', updates.darkMode);
      }

      return { settings: newSettings };
    }),

  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.settings.darkMode;
      const newSettings = { ...state.settings, darkMode: newDarkMode };
      saveToStorage(STORAGE_KEYS.SETTINGS, newSettings);
      document.body.classList.toggle('dark-mode', newDarkMode);
      return { settings: newSettings };
    }),

  setFirstTime: (value) =>
    set((state) => {
      const newSettings = { ...state.settings, firstTime: value };
      saveToStorage(STORAGE_KEYS.SETTINGS, newSettings);
      return { settings: newSettings };
    }),
}));
