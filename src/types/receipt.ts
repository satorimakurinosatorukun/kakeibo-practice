/**
 * Receipt and OCR related types
 */

export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface Receipt {
  id: string;
  items: ReceiptItem[];
  totalPrice: number;
  store?: string;
  date: string; // ISO string
  imageUrl?: string;
  confidence: number; // 0-1
  createdAt: string; // ISO string
}

export interface ReceiptFormData {
  items: ReceiptItem[];
  totalPrice: number;
  store?: string;
}
