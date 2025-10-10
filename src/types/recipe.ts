/**
 * レシピ（Recipe）の型定義
 */
export interface Recipe {
  id: string;
  title: string;
  content: string; // レシピ本文（マークダウン形式）
  ingredients: string[]; // 材料リスト
  difficulty?: RecipeDifficulty;
  dietaryRestriction?: DietaryRestriction;
  customRequest?: string; // ユーザーの自由記入リクエスト
  isFavorite: boolean;
  createdAt: string;
}

export type RecipeDifficulty =
  | 'none' // 指定なし
  | 'super_easy' // 超簡単
  | 'under_5min' // 5分以内
  | 'under_10min' // 10分以内
  | 'no_fire'; // 火を使わない

export type DietaryRestriction =
  | 'none' // なし
  | 'vegetarian' // ベジタリアン
  | 'vegan'; // ヴィーガン

export interface RecipeGenerateRequest {
  ingredients: string[];
  difficulty?: RecipeDifficulty;
  dietaryRestriction?: DietaryRestriction;
  customRequest?: string;
}

export interface RecipeHistory {
  id: string;
  recipe: Recipe;
  generatedAt: string;
}
