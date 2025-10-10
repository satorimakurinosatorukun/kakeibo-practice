/**
 * 食事記録（Intake）の型定義
 */
export interface Intake {
  id: string;
  name: string;
  calories: number;
  price: number;
  date: string; // ISO 8601形式
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  barcode?: string; // バーコード情報
  manufacturer?: string; // メーカー名
  createdAt: string;
  updatedAt?: string;
}

export interface IntakeFormData {
  name: string;
  calories: number;
  price: number;
  category?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}
