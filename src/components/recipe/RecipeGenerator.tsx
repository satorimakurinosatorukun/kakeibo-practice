/**
 * レシピ生成フォームコンポーネント
 */
import React, { useState } from 'react';
import { useStockStore } from '../../store';
import { generateRecipe } from '../../api/gemini';
import type { RecipeDifficulty, DietaryRestriction, Recipe } from '../../types';
import { generateUUID } from '../../utils/uuid';

interface RecipeGeneratorProps {
  onRecipeGenerated: (recipe: Recipe) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({
  onRecipeGenerated,
  isLoading,
  setIsLoading,
}) => {
  const { stocks } = useStockStore();
  const [ingredients, setIngredients] = useState('');
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>('none');
  const [dietaryRestriction, setDietaryRestriction] = useState<DietaryRestriction>('none');
  const [customRequest, setCustomRequest] = useState('');

  const difficultyOptions: Array<{ value: RecipeDifficulty; label: string; emoji: string }> = [
    { value: 'none', label: '指定なし', emoji: '✨' },
    { value: 'super_easy', label: '超簡単', emoji: '😊' },
    { value: 'under_5min', label: '5分以内', emoji: '⚡' },
    { value: 'under_10min', label: '10分以内', emoji: '⏱️' },
    { value: 'no_fire', label: '火を使わない', emoji: '🧊' },
  ];

  const dietaryOptions: Array<{ value: DietaryRestriction; label: string; emoji: string }> = [
    { value: 'none', label: '指定なし', emoji: '🍽️' },
    { value: 'vegetarian', label: 'ベジタリアン', emoji: '🥗' },
    { value: 'vegan', label: 'ヴィーガン', emoji: '🌱' },
  ];

  const handleUseStockIngredients = () => {
    const stockNames = stocks
      .filter((stock) => stock.quantity > 0)
      .map((stock) => stock.name)
      .slice(0, 10) // 最大10個まで
      .join(', ');
    setIngredients(stockNames);
  };

  const handleGenerate = async () => {
    if (!ingredients.trim()) {
      alert('材料を入力してください');
      return;
    }

    setIsLoading(true);
    try {
      const ingredientArray = ingredients.split(',').map((item) => item.trim());
      const recipeContent = await generateRecipe(
        ingredientArray,
        dietaryRestriction,
        difficulty,
        customRequest
      );

      const newRecipe: Recipe = {
        id: generateUUID(),
        title: `${ingredientArray.slice(0, 3).join('、')}を使ったレシピ`,
        content: recipeContent,
        ingredients: ingredientArray,
        difficulty,
        dietaryRestriction,
        customRequest,
        isFavorite: false,
        createdAt: new Date().toISOString(),
      };

      onRecipeGenerated(newRecipe);
    } catch (error) {
      console.error('レシピ生成エラー:', error);
      alert('レシピの生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>🍳 レシピを生成</h3>

      <label>材料（カンマ区切り）</label>
      <input
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="例: 鶏肉, じゃがいも, 玉ねぎ"
        disabled={isLoading}
      />

      <button
        onClick={handleUseStockIngredients}
        style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          marginBottom: '16px',
        }}
        disabled={isLoading}
      >
        📦 在庫の材料を使う
      </button>

      <label>難易度</label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {difficultyOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setDifficulty(option.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: `2px solid ${difficulty === option.value ? 'var(--primary)' : '#ddd'}`,
              background: difficulty === option.value ? 'var(--primary)' : 'white',
              color: difficulty === option.value ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: difficulty === option.value ? 600 : 400,
            }}
            disabled={isLoading}
          >
            {option.emoji} {option.label}
          </button>
        ))}
      </div>

      <label>食事制限</label>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {dietaryOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setDietaryRestriction(option.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: `2px solid ${dietaryRestriction === option.value ? 'var(--primary)' : '#ddd'}`,
              background: dietaryRestriction === option.value ? 'var(--primary)' : 'white',
              color: dietaryRestriction === option.value ? 'white' : '#333',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: dietaryRestriction === option.value ? 600 : 400,
            }}
            disabled={isLoading}
          >
            {option.emoji} {option.label}
          </button>
        ))}
      </div>

      <label>カスタムリクエスト（任意）</label>
      <textarea
        value={customRequest}
        onChange={(e) => setCustomRequest(e.target.value)}
        placeholder="例: 辛めに作りたい、子供向けに優しい味で"
        rows={3}
        style={{
          width: '100%',
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontSize: '1rem',
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
        disabled={isLoading}
      />

      <button className="submit" onClick={handleGenerate} disabled={isLoading}>
        ✨ レシピを生成する
      </button>
    </div>
  );
};
