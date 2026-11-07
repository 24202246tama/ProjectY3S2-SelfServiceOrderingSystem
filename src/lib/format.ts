export function formatPrice(value: number): string {
  // Papua New Guinea Kina
  return `K${value.toFixed(2)}`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function minutesSince(timestamp: number, now: number): number {
  return Math.max(0, Math.floor((now - timestamp) / 60000));
}

export function formatElapsed(timestamp: number, now: number): string {
  const minutes = minutesSince(timestamp, now);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours} h ${minutes % 60} min ago`;
}
