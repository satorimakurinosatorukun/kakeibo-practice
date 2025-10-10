/**
 * 買い物リスト画面コンポーネント
 */
import React from 'react';
import { ShoppingActions } from './ShoppingActions';
import { ShoppingForm } from './ShoppingForm';
import { ShoppingList } from './ShoppingList';

export const ShoppingScreen: React.FC = () => {
  return (
    <section className="screen active">
      <h2>買い物リスト</h2>
      <ShoppingActions />
      <ShoppingForm />
      <ShoppingList />
    </section>
  );
};
