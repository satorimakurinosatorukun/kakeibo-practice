/**
 * UUID生成ユーティリティ
 */
import { v4 as uuidv4 } from 'uuid';

export function generateUUID(): string {
  return uuidv4();
}
