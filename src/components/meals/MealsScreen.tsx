/**
 * 食事記録画面コンポーネント
 */
import React from 'react';
import { MealForm } from './MealForm';
import { MealList } from './MealList';

export const MealsScreen: React.FC = () => {
  return (
    <section className="screen active">
      <h2>食事記録</h2>
      <MealForm />
      <MealList />
    </section>
  );
};
