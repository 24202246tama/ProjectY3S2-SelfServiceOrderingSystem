import { APP_SCHEME, MAX_TABLE_NUMBER } from '@/constants/config';

function toTableNumber(value: string): number | null {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= MAX_TABLE_NUMBER ? parsed : null;
}

/**
 * Extracts a table number from a scanned QR payload. Accepts:
 * - `selfservicesystem://table/5` (deep link printed on table cards)
 * - `https://example.com/order?table=5`
 * - `TABLE-5`, `table:5`, `Table 5`
 * - `5`
 */
export function parseTableNumber(data: string): number | null {
  const trimmed = data.trim();
  if (/^\d+$/.test(trimmed)) return toTableNumber(trimmed);

  const match = trimmed.match(/table[\s/:=_-]*(\d+)/i);
  return match ? toTableNumber(match[1]) : null;
}

export function tableQrPayload(tableNumber: number): string {
  return `${APP_SCHEME}://table/${tableNumber}`;
}
