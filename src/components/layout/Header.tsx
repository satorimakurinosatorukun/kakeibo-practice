/**
 * ヘッダーコンポーネント
 */
import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return <header>{title}</header>;
};
