/**
 * お気に入りレシピ表示コンポーネント
 */
import React from 'react';
import type { Recipe } from '../../types';
import { useRecipeStore } from '../../store';
import { MdStar, MdChatBubble } from 'react-icons/md';
import { FiSmile, FiZap, FiClock } from 'react-icons/fi';
import { BsSnow } from 'react-icons/bs';

interface FavoriteRecipesProps {
  onRecipeSelect: (recipe: Recipe) => void;
}

export const FavoriteRecipes: React.FC<FavoriteRecipesProps> = ({ onRecipeSelect }) => {
  const { favoriteRecipes, removeFromFavorites } = useRecipeStore();

  if (favoriteRecipes.length === 0) {
    return null;
  }

  const handleRemoveFavorite = (e: React.MouseEvent, recipeId: string) => {
    e.stopPropagation();
    if (confirm('お気に入りから削除しますか？')) {
      removeFromFavorites(recipeId);
    }
  };

  return (
    <div className="card">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MdStar size={20} color="#fbbf24" />
        お気に入りレシピ
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        {favoriteRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => onRecipeSelect(recipe)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: 'var(--card)',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--background)';
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--card)';
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px',
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '1rem', flex: 1 }}>
                {recipe.title}
              </div>
              <button
                onClick={(e) => handleRemoveFavorite(e, recipe.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '0 4px',
                  color: '#fbbf24',
                }}
                title="お気に入りから削除"
              >
                <MdStar size={24} />
              </button>
            </div>

            <div
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary, #666)',
                marginBottom: '8px',
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontWeight: 500 }}>材料:</span>
              {recipe.ingredients && recipe.ingredients.slice(0, 4).map((ingredient, index) => (
                <span key={index}>
                  {ingredient}
                  {index < Math.min((recipe.ingredients?.length || 0) - 1, 3) ? '、' : ''}
                </span>
              ))}
              {recipe.ingredients && recipe.ingredients.length > 4 && (
                <span style={{ color: 'var(--text-secondary, #999)' }}>
                  他{recipe.ingredients.length - 4}個
                </span>
              )}
            </div>

            {((recipe.difficulty && recipe.difficulty !== 'none') || (recipe.dietaryRestriction && recipe.dietaryRestriction !== 'none')) && (
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '8px',
                  flexWrap: 'wrap',
                }}
              >
                {recipe.difficulty && recipe.difficulty !== 'none' && (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: '#f0fdf4',
                      color: '#15803d',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {
                        {
                          super_easy: <><FiSmile size={14} /> 超簡単</>,
                          under_5min: <><FiZap size={14} /> 5分以内</>,
                          under_10min: <><FiClock size={14} /> 10分以内</>,
                          no_fire: <><BsSnow size={14} /> 火を使わない</>,
                          none: '',
                        }[recipe.difficulty]
                      }
                    </span>
                  </span>
                )}
                {recipe.dietaryRestriction && recipe.dietaryRestriction !== 'none' && (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: '#fef3c7',
                      color: '#92400e',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                    }}
                  >
                    {
                      {
                        vegetarian: '🥗 ベジタリアン',
                        vegan: '🌱 ヴィーガン',
                        none: '',
                      }[recipe.dietaryRestriction]
                    }
                  </span>
                )}
              </div>
            )}

            {recipe.customRequest && (
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary, #666)',
                  fontStyle: 'italic',
                  padding: '6px 10px',
                  background: 'var(--background)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                }}
              >
                <MdChatBubble size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                {recipe.customRequest}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
