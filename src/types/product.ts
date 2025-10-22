/**
 * バーコードスキャンで取得する商品情報の型定義
 */
export interface ProductInfo {
  barcode: string;
  name: string;
  calories?: number;
  price?: number;
  manufacturer?: string;
  imageUrl?: string;
  source: ProductSource; // どのAPIから取得したか
}

export type ProductSource =
  | 'rakuten_ichiba' // 楽天市場商品検索API
  | 'rakuten_product' // 楽天商品検索API
  | 'jancode_lookup' // JAN Code Lookup API
  | 'openfoodfacts' // Open Food Facts API
  | 'mock'; // モックデータ
