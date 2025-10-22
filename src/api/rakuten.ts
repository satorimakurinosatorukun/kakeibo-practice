/**
 * api/rakuten.ts — 商品検索API連携（4つのAPI統合）
 *
 * JANコード（バーコード）から商品情報を取得します。
 * 複数のAPIを順番に試して、最も信頼性の高いデータを取得します。
 *
 * API優先順位:
 * 1. 楽天市場商品検索API (IchibaItem/Search) - 最も信頼性が高い
 * 2. 楽天商品検索API (Product/Search) - 幅広いカバレッジ
 * 3. JAN Code Lookup API - 日本の商品に特化
 * 4. Open Food Facts API - 食品専門
 */

import type { ProductInfo } from '../types';

// APIキー（環境変数から取得、または直接設定）
const RAKUTEN_APP_ID = import.meta.env.VITE_RAKUTEN_APP_ID || '';
const JANCODE_APP_ID = import.meta.env.VITE_JANCODE_APP_ID || 'b72c14dc75bcde18fb7d3628bf7e92b7';

/**
 * JANコードから商品情報を検索（4つのAPIを順番に試す）
 */
export async function searchProductByJAN(janCode: string): Promise<ProductInfo | null> {
  console.log(`[商品検索] JANコード: ${janCode}`);

  // 1. 楽天市場商品検索API
  if (RAKUTEN_APP_ID) {
    try {
      const result = await searchRakutenIchiba(janCode);
      if (result) {
        console.log('[商品検索] 楽天市場APIで商品発見');
        return result;
      }
    } catch (error) {
      console.warn('[商品検索] 楽天市場API失敗:', error);
    }
  }

  // 2. 楽天商品検索API
  if (RAKUTEN_APP_ID) {
    try {
      const result = await searchRakutenProduct(janCode);
      if (result) {
        console.log('[商品検索] 楽天商品APIで商品発見');
        return result;
      }
    } catch (error) {
      console.warn('[商品検索] 楽天商品API失敗:', error);
    }
  }

  // 3. JAN Code Lookup API
  if (JANCODE_APP_ID) {
    try {
      const result = await searchJanCodeLookup(janCode);
      if (result) {
        console.log('[商品検索] JAN Code Lookup APIで商品発見');
        return result;
      }
    } catch (error) {
      console.warn('[商品検索] JAN Code Lookup API失敗:', error);
    }
  }

  // 4. Open Food Facts API
  try {
    const result = await searchOpenFoodFacts(janCode);
    if (result) {
      console.log('[商品検索] Open Food Facts APIで商品発見');
      return result;
    }
  } catch (error) {
    console.warn('[商品検索] Open Food Facts API失敗:', error);
  }

  // すべて失敗した場合はモックデータ
  console.warn('[商品検索] すべてのAPIで商品が見つかりませんでした。モックデータを使用します。');
  return getMockProduct(janCode);
}

/**
 * 1. 楽天市場商品検索API (IchibaItem/Search)
 */
async function searchRakutenIchiba(janCode: string): Promise<ProductInfo | null> {
  const url = new URL('https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601');
  url.searchParams.set('applicationId', RAKUTEN_APP_ID);
  url.searchParams.set('keyword', janCode);
  url.searchParams.set('hits', '1');

  const response = await fetch(url.toString());
  if (!response.ok) return null;

  const data = await response.json();
  if (!data.Items || data.Items.length === 0) return null;

  const item = data.Items[0].Item;
  return {
    barcode: janCode,
    name: item.itemName,
    price: item.itemPrice,
    manufacturer: item.shopName || '',
    imageUrl: item.mediumImageUrls?.[0]?.imageUrl || '',
    source: 'rakuten_ichiba',
  };
}

/**
 * 2. 楽天商品検索API (Product/Search)
 */
async function searchRakutenProduct(janCode: string): Promise<ProductInfo | null> {
  const url = new URL('https://app.rakuten.co.jp/services/api/Product/Search/20170426');
  url.searchParams.set('applicationId', RAKUTEN_APP_ID);
  url.searchParams.set('keyword', janCode);
  url.searchParams.set('hits', '1');

  const response = await fetch(url.toString());
  if (!response.ok) return null;

  const data = await response.json();
  if (!data.Products || data.Products.length === 0) return null;

  const product = data.Products[0].Product;
  return {
    barcode: janCode,
    name: product.productName,
    price: product.minPrice || 0,
    manufacturer: product.makerName || '',
    imageUrl: product.mediumImageUrl || '',
    source: 'rakuten_product',
  };
}

/**
 * 3. JAN Code Lookup API
 */
async function searchJanCodeLookup(janCode: string): Promise<ProductInfo | null> {
  const url = new URL('https://api.jancodelookup.com/');
  url.searchParams.set('appId', JANCODE_APP_ID);
  url.searchParams.set('query', janCode);
  url.searchParams.set('type', 'code');

  const response = await fetch(url.toString());
  if (!response.ok) return null;

  const data = await response.json();
  if (!data.product || data.product.length === 0) return null;

  const product = data.product[0];
  return {
    barcode: janCode,
    name: product.itemName || '',
    price: 0, // APIには価格情報がない
    manufacturer: product.makerName || product.brandName || '',
    imageUrl: product.itemImageUrl || '',
    source: 'jancode_lookup',
  };
}

/**
 * 4. Open Food Facts API
 */
async function searchOpenFoodFacts(janCode: string): Promise<ProductInfo | null> {
  const url = `https://world.openfoodfacts.org/api/v0/product/${janCode}.json`;
  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  if (data.status !== 1 || !data.product) return null;

  const product = data.product;
  return {
    barcode: janCode,
    name: product.product_name || product.product_name_ja || '',
    calories: product.nutriments?.['energy-kcal_100g'],
    price: 0,
    manufacturer: product.brands || '',
    imageUrl: product.image_url || '',
    source: 'openfoodfacts',
  };
}

/**
 * モックデータ（すべてのAPIで見つからない場合のフォールバック）
 */
function getMockProduct(janCode: string): ProductInfo {
  const mockDatabase: Record<string, Omit<ProductInfo, 'barcode' | 'source'>> = {
    '4902102072453': {
      name: '明治おいしい牛乳 900ml',
      price: 258,
      calories: 67,
      manufacturer: '明治',
      imageUrl: '',
    },
    '4901777313989': {
      name: 'サントリー天然水 2L',
      price: 138,
      calories: 0,
      manufacturer: 'サントリー',
      imageUrl: '',
    },
    '4902430479318': {
      name: 'ポカリスエット 500ml',
      price: 148,
      calories: 125,
      manufacturer: '大塚製薬',
      imageUrl: '',
    },
  };

  const mock = mockDatabase[janCode];
  if (mock) {
    return {
      barcode: janCode,
      ...mock,
      source: 'mock',
    };
  }

  // 完全に不明な商品
  return {
    barcode: janCode,
    name: `商品 (${janCode})`,
    price: 0,
    manufacturer: '不明',
    source: 'mock',
  };
}

/**
 * APIが有効かどうかを確認
 */
export function isRakutenEnabled(): boolean {
  return !!RAKUTEN_APP_ID;
}

export function isJanCodeEnabled(): boolean {
  return !!JANCODE_APP_ID;
}
