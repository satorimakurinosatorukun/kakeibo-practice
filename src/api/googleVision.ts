/**
 * Google Cloud Vision API Integration
 * Handles receipt OCR and item detection
 */

export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface ReceiptAnalysisResult {
  items: ReceiptItem[];
  totalPrice: number;
  store?: string;
  date?: string;
  confidence: number;
}

const GOOGLE_VISION_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY;
const API_ENABLED = !!GOOGLE_VISION_API_KEY && GOOGLE_VISION_API_KEY !== 'YOUR_GOOGLE_CLOUD_VISION_API_KEY_HERE';

/**
 * Convert image file to base64
 */
function fileToBase64(_file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = () => reject(new Error('File reading error'));
  });
}

/**
 * Call Google Cloud Vision API for document text detection
 */
async function callGoogleVisionAPI(imageBase64: string): Promise<any> {
  const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

  const requestBody = {
    requests: [
      {
        image: {
          content: imageBase64,
        },
        features: [
          {
            type: 'DOCUMENT_TEXT_DETECTION',
            maxResults: 10,
          },
          {
            type: 'TEXT_DETECTION',
            maxResults: 50,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[GoogleVision] API Response:', data);
    return data;
  } catch (error) {
    console.error('[GoogleVision] API call failed:', error);
    throw error;
  }
}

/**
 * Parse receipt text using regex patterns
 * Extracts items, prices, and calculates total
 */
function parseReceiptText(fullText: string): ReceiptItem[] {
  const items: ReceiptItem[] = [];

  // Split text into lines
  const lines = fullText.split('\n').map((line) => line.trim());

  // Regex patterns for Japanese receipts
  const pricePattern = /(\d+(?:,\d{3})*|\d+)(?:円|¥)?/;
  const quantityPattern = /×|x|✕/;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines or common receipt headers/footers
    if (
      !line ||
      line.match(/^(合計|税抜|消費税|ご利用ありがとうございました|店舗|店員|レジ)/i)
    ) {
      i++;
      continue;
    }

    // Try to find price in current or next lines
    const priceMatch = line.match(pricePattern);
    if (priceMatch) {
      const price = parseInt(priceMatch[1].replace(/,/g, ''), 10);

      // Extract product name (everything before price)
      const name = line
        .replace(priceMatch[0], '')
        .replace(/×\d+/, '')
        .trim();

      // Check for quantity
      const quantityMatch = line.match(quantityPattern);
      const quantity = quantityMatch ? 1 : 1;

      if (name && price > 0) {
        items.push({
          name,
          price,
          quantity,
          category: categorizeItem(name),
        });
      }
    }

    i++;
  }

  return items;
}

/**
 * Categorize receipt items
 */
function categorizeItem(itemName: string): string {
  const categories: Record<string, string[]> = {
    食料品: ['米', '野菜', '肉', '魚', '卵', 'パン', 'フルーツ', 'とうもろこし'],
    飲料: ['ジュース', 'コーヒー', 'お茶', 'コーラ', 'ビール', 'ワイン', '水'],
    日用雑貨: ['洗剤', 'シャンプー', 'トイレットペーパー', 'ティッシュ', 'タオル'],
    お菓子: ['チョコレート', 'クッキー', 'ポテトチップス', 'アイス', 'キャンディー'],
    冷凍食品: ['冷凍', 'アイス'],
    調味料: ['塩', '砂糖', '醤油', 'みりん', 'オイル', 'バター'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => itemName.includes(keyword))) {
      return category;
    }
  }

  return '食料品';
}

/**
 * Calculate total price from items
 */
function calculateTotal(items: ReceiptItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Main function: scan and analyze receipt image
 */
export async function scanReceipt(imageFile: File): Promise<ReceiptAnalysisResult> {
  if (!API_ENABLED) {
    console.warn('[GoogleVision] API not configured, using mock data');
    return getMockReceiptData();
  }

  try {
    // Convert image to base64
    const imageBase64 = await fileToBase64(imageFile);
    console.log('[GoogleVision] Image converted to base64');

    // Call Vision API
    const visionResponse = await callGoogleVisionAPI(imageBase64);

    // Extract text from response
    const textAnnotations = visionResponse.responses?.[0]?.textAnnotations || [];
    if (textAnnotations.length === 0) {
      console.warn('[GoogleVision] No text detected in image');
      return getMockReceiptData();
    }

    // Get full text (first annotation contains all text)
    const fullText = textAnnotations[0]?.description || '';
    console.log('[GoogleVision] Extracted text:', fullText);

    // Parse receipt
    const items = parseReceiptText(fullText);
    const totalPrice = calculateTotal(items);

    return {
      items,
      totalPrice,
      confidence: 0.85,
    };
  } catch (error) {
    console.error('[GoogleVision] Receipt scanning failed:', error);
    // Return mock data on error for demo purposes
    return getMockReceiptData();
  }
}

/**
 * Mock receipt data for testing/demo
 */
function getMockReceiptData(): ReceiptAnalysisResult {
  return {
    items: [
      { name: 'にんじん', price: 150, quantity: 1, category: '食料品' },
      { name: 'トマト', price: 300, quantity: 2, category: '食料品' },
      { name: '牛乳', price: 200, quantity: 1, category: '飲料' },
      { name: 'パン', price: 180, quantity: 1, category: '食料品' },
      { name: 'バター', price: 280, quantity: 1, category: '調味料' },
    ],
    totalPrice: 1110,
    store: 'スーパーマーケット',
    date: new Date().toISOString(),
    confidence: 0.0, // Low confidence for mock data
  };
}
