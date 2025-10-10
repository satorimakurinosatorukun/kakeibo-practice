/**
 * レシピ履歴表示コンポーネント
 */
import React from 'react';
import type { Recipe } from '../../types';
import { useRecipeStore } from '../../store';

interface RecipeHistoryProps {
  onRecipeSelect: (recipe: Recipe) => void;
}

export const RecipeHistory: React.FC<RecipeHistoryProps> = ({ onRecipeSelect }) => {
  const { recipeHistory } = useRecipeStore();

  if (recipeHistory.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'たった今';
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="card">
      <h3>📜 レシピ履歴</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {recipeHistory.map((historyItem) => (
          <div
            key={historyItem.id}
            onClick={() => onRecipeSelect(historyItem.recipe)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: 'var(--card)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--background)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--card)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '6px',
              }}
            >
              <div style={{ fontWeight: 500, fontSize: '0.95rem', flex: 1 }}>
                {historyItem.recipe.title}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary, #999)',
                  whiteSpace: 'nowrap',
                  marginLeft: '8px',
                }}
              >
                {formatDate(historyItem.generatedAt)}
              </div>
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary, #666)',
                display: 'flex',
                gap: '4px',
                flexWrap: 'wrap',
              }}
            >
              {historyItem.recipe.ingredients.slice(0, 3).map((ingredient: string, index: number) => (
                <span key={index}>
                  {ingredient}
                  {index < Math.min(historyItem.recipe.ingredients.length - 1, 2) ? '、' : ''}
                </span>
              ))}
              {historyItem.recipe.ingredients.length > 3 && (
                <span style={{ color: 'var(--text-secondary, #999)' }}>
                  他{historyItem.recipe.ingredients.length - 3}個
                </span>
              )}
            </div>
            {(historyItem.recipe.difficulty !== 'none' || historyItem.recipe.dietaryRestriction !== 'none') && (
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  marginTop: '6px',
                  flexWrap: 'wrap',
                }}
              >
                {historyItem.recipe.difficulty && historyItem.recipe.difficulty !== 'none' && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '8px',
                      background: '#f0fdf4',
                      color: '#15803d',
                      fontSize: '0.75rem',
                    }}
                  >
                    {
                      {
                        super_easy: '😊',
                        under_5min: '⚡',
                        under_10min: '⏱️',
                        no_fire: '🧊',
                        none: '',
                      }[historyItem.recipe.difficulty]
                    }
                  </span>
                )}
                {historyItem.recipe.dietaryRestriction && historyItem.recipe.dietaryRestriction !== 'none' && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '8px',
                      background: '#fef3c7',
                      color: '#92400e',
                      fontSize: '0.75rem',
                    }}
                  >
                    {
                      {
                        vegetarian: '🥗',
                        vegan: '🌱',
                        none: '',
                      }[historyItem.recipe.dietaryRestriction]
                    }
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
