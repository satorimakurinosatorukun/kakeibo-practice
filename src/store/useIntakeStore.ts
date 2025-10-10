/**
 * 食事記録ストア（Zustand）
 */
import { create } from 'zustand';
import type { Intake, IntakeFormData } from '../types';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage';
import { generateUUID } from '../utils/uuid';

interface IntakeStore {
  intakes: Intake[];
  addIntake: (data: IntakeFormData) => void;
  updateIntake: (id: string, data: Partial<IntakeFormData>) => void;
  deleteIntake: (id: string) => void;
  getIntakesByDate: (date: string) => Intake[];
  getTotalCaloriesByDate: (date: string) => number;
  getTotalPriceByDate: (date: string) => number;
}

export const useIntakeStore = create<IntakeStore>((set, get) => ({
  intakes: getFromStorage<Intake[]>(STORAGE_KEYS.INTAKES, []),

  addIntake: (data) =>
    set((state) => {
      const newIntake: Intake = {
        id: generateUUID(),
        ...data,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      const newIntakes = [...state.intakes, newIntake];
      saveToStorage(STORAGE_KEYS.INTAKES, newIntakes);
      return { intakes: newIntakes };
    }),

  updateIntake: (id, data) =>
    set((state) => {
      const newIntakes = state.intakes.map((intake) =>
        intake.id === id
          ? { ...intake, ...data, updatedAt: new Date().toISOString() }
          : intake
      );
      saveToStorage(STORAGE_KEYS.INTAKES, newIntakes);
      return { intakes: newIntakes };
    }),

  deleteIntake: (id) =>
    set((state) => {
      const newIntakes = state.intakes.filter((intake) => intake.id !== id);
      saveToStorage(STORAGE_KEYS.INTAKES, newIntakes);
      return { intakes: newIntakes };
    }),

  getIntakesByDate: (date) => {
    const intakes = get().intakes;
    return intakes.filter((intake) => intake.date.startsWith(date));
  },

  getTotalCaloriesByDate: (date) => {
    const intakes = get().getIntakesByDate(date);
    return intakes.reduce((sum, intake) => sum + intake.calories, 0);
  },

  getTotalPriceByDate: (date) => {
    const intakes = get().getIntakesByDate(date);
    return intakes.reduce((sum, intake) => sum + intake.price, 0);
  },
}));
