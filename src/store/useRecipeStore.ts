/**
 * レシピストア（Zustand）
 */
import { create } from 'zustand';
import { Recipe, RecipeHistory } from '../types';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/localStorage';
import { generateUUID } from '../utils/uuid';

interface RecipeStore {
  recipeHistory: RecipeHistory[];
  favoriteRecipes: Recipe[];
  addToHistory: (recipe: Recipe) => void;
  addToFavorites: (recipe: Recipe) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const MAX_HISTORY = 10;

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipeHistory: getFromStorage<RecipeHistory[]>(STORAGE_KEYS.RECIPE_HISTORY, []),
  favoriteRecipes: getFromStorage<Recipe[]>(STORAGE_KEYS.FAVORITE_RECIPES, []),

  addToHistory: (recipe) =>
    set((state) => {
      const historyItem: RecipeHistory = {
        id: generateUUID(),
        recipe,
        generatedAt: new Date().toISOString(),
      };

      // 最新10件のみ保持
      const newHistory = [historyItem, ...state.recipeHistory].slice(0, MAX_HISTORY);
      saveToStorage(STORAGE_KEYS.RECIPE_HISTORY, newHistory);
      return { recipeHistory: newHistory };
    }),

  addToFavorites: (recipe) =>
    set((state) => {
      // 重複チェック
      const exists = state.favoriteRecipes.find((fav) => fav.id === recipe.id);
      if (exists) {
        return state;
      }

      const favoriteRecipe = { ...recipe, isFavorite: true };
      const newFavorites = [favoriteRecipe, ...state.favoriteRecipes];
      saveToStorage(STORAGE_KEYS.FAVORITE_RECIPES, newFavorites);
      return { favoriteRecipes: newFavorites };
    }),

  removeFromFavorites: (id) =>
    set((state) => {
      const newFavorites = state.favoriteRecipes.filter((recipe) => recipe.id !== id);
      saveToStorage(STORAGE_KEYS.FAVORITE_RECIPES, newFavorites);
      return { favoriteRecipes: newFavorites };
    }),

  isFavorite: (id) => {
    const favorites = get().favoriteRecipes;
    return favorites.some((recipe) => recipe.id === id);
  },
}));
