import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { formatPrice } from '@/lib/format';
import type { CartItem } from '@/types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export function OrderSummary({ items, subtotal, tax, total }: OrderSummaryProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.itemId} style={styles.row}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.quantity} × {item.name}
          </Text>
          <Text style={styles.value}>{formatPrice(item.price * item.quantity)}</Text>
        </View>
      ))}
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.muted}>Subtotal</Text>
        <Text style={styles.muted}>{formatPrice(subtotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.muted}>Tax</Text>
        <Text style={styles.muted}>{formatPrice(tax)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.total}>Total</Text>
        <Text style={styles.total}>{formatPrice(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  itemName: { flex: 1, fontSize: 15, color: colors.text },
  value: { fontSize: 15, color: colors.text, fontVariant: ['tabular-nums'] },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.xs },
  muted: { fontSize: 14, color: colors.textMuted, fontVariant: ['tabular-nums'] },
  total: { fontSize: 17, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
});
