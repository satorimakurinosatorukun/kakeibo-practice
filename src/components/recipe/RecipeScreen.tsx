/**
 * AIレシピ生成画面コンポーネント
 */
import React, { useState } from 'react';
import { RecipeGenerator } from './RecipeGenerator';
import { RecipeDisplay } from './RecipeDisplay';
import { RecipeHistory } from './RecipeHistory';
import { FavoriteRecipes } from './FavoriteRecipes';
import type { Recipe } from '../../types';
import { MdRestaurantMenu } from 'react-icons/md';

export const RecipeScreen: React.FC = () => {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className="screen active">
      <h2>AIレシピ生成</h2>
      <RecipeGenerator
        onRecipeGenerated={setCurrentRecipe}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
      {isLoading && (
        <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px', color: 'var(--primary)' }}>
            <MdRestaurantMenu size={48} />
          </div>
          <div style={{ fontWeight: 600, marginBottom: '8px' }}>レシピを生成中...</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary, #666)' }}>
            AIがレシピを考えています
          </div>
        </div>
      )}
      {currentRecipe && !isLoading && <RecipeDisplay recipe={currentRecipe} />}
      <RecipeHistory onRecipeSelect={setCurrentRecipe} />
      <FavoriteRecipes onRecipeSelect={setCurrentRecipe} />
    </section>
  );
};
