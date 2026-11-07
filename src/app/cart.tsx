import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { QuantityStepper } from '@/components/QuantityStepper';
import { colors, radius, spacing } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/format';
import type { CartItem } from '@/types';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { items, subtotal, tax, total, increment, decrement, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <EmptyState emoji="🛒" title="Your cart is empty" message="Add a few dishes from the menu to get started.">
        <Button title="Browse menu" onPress={() => router.replace('/menu')} />
      </EmptyState>
    );
  }

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.row}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <View style={styles.rowBody}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.unitPrice}>{formatPrice(item.price)} each</Text>
        <Pressable accessibilityRole="button" hitSlop={8} onPress={() => removeItem(item.itemId)}>
          <Text style={styles.remove}>Remove</Text>
        </Pressable>
      </View>
      <View style={styles.rowEnd}>
        <Text style={styles.lineTotal}>{formatPrice(item.price * item.quantity)}</Text>
        <QuantityStepper
          quantity={item.quantity}
          label={item.name}
          onIncrement={() => increment(item.itemId)}
          onDecrement={() => decrement(item.itemId)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.itemId}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <Button title="Clear cart" variant="ghost" size="sm" onPress={clearCart} style={styles.clear} />
        }
      />
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <View style={styles.totalRow}>
          <Text style={styles.muted}>Subtotal</Text>
          <Text style={styles.muted}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.muted}>Tax</Text>
          <Text style={styles.muted}>{formatPrice(tax)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.total}>Total</Text>
          <Text style={styles.total}>{formatPrice(total)}</Text>
        </View>
        <Button title="Proceed to checkout" onPress={() => router.push('/checkout')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg },
  separator: { height: spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: { fontSize: 32 },
  rowBody: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  unitPrice: { fontSize: 13, color: colors.textMuted },
  remove: { fontSize: 13, fontWeight: '600', color: colors.danger, marginTop: spacing.xs },
  rowEnd: { alignItems: 'flex-end', gap: spacing.sm },
  lineTotal: { fontSize: 15, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] },
  clear: { alignSelf: 'center', marginTop: spacing.md },
  footer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  muted: { fontSize: 14, color: colors.textMuted, fontVariant: ['tabular-nums'] },
  total: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.sm, fontVariant: ['tabular-nums'] },
});
