import { Link, router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { QuantityStepper } from '@/components/QuantityStepper';
import { colors, radius, spacing } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useMenu } from '@/context/MenuContext';
import { CATEGORIES } from '@/data/menu';
import { formatPrice } from '@/lib/format';
import type { Category, MenuItem } from '@/types';

type Filter = Category | 'All';

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const { items } = useMenu();
  const { tableNumber, itemCount, subtotal, addItem, increment, decrement, quantityOf } = useCart();
  const [filter, setFilter] = useState<Filter>('All');

  const visibleItems = filter === 'All' ? items : items.filter((item) => item.category === filter);
  const filters: Filter[] = ['All', ...CATEGORIES];

  const renderItem = ({ item }: { item: MenuItem }) => {
    const quantity = quantityOf(item.id);
    return (
      <View style={[styles.itemCard, !item.available && styles.itemUnavailable]}>
        <View style={styles.emojiBox}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        <View style={styles.itemBody}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          {item.price > 0 ? <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text> : null}
        </View>
        <View style={styles.itemAction}>
          {!item.available ? (
            <Text style={styles.soldOut}>Sold out</Text>
          ) : quantity > 0 ? (
            <QuantityStepper
              quantity={quantity}
              label={item.name}
              onIncrement={() => increment(item.id)}
              onDecrement={() => decrement(item.id)}
            />
          ) : (
            <Button title="Add" size="sm" onPress={() => addItem(item)} />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      {tableNumber ? (
        <View style={styles.tableBanner}>
          <Text style={styles.tableBannerText}>Ordering for Table {tableNumber}</Text>
        </View>
      ) : (
        <Link href="/scan" asChild>
          <Pressable style={[styles.tableBanner, styles.tableBannerWarning]}>
            <Text style={[styles.tableBannerText, styles.tableBannerWarningText]}>
              No table selected — tap to scan your table QR
            </Text>
          </Pressable>
        </Link>
      )}

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filters.map((value) => {
            const selected = value === filter;
            return (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setFilter(value)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{value}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + (itemCount > 0 ? 110 : spacing.xl) }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {itemCount > 0 ? (
        <View style={[styles.cartBar, { paddingBottom: insets.bottom + spacing.md }]}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/cart')}
            style={({ pressed }) => [styles.cartButton, pressed && styles.pressed]}
          >
            <View style={styles.cartCount}>
              <Text style={styles.cartCountText}>{itemCount}</Text>
            </View>
            <Text style={styles.cartLabel}>View cart</Text>
            <Text style={styles.cartTotal}>{formatPrice(subtotal)}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  tableBanner: { backgroundColor: colors.primarySoft, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg },
  tableBannerText: { color: colors.primary, fontWeight: '700', textAlign: 'center' },
  tableBannerWarning: { backgroundColor: colors.warningSoft },
  tableBannerWarningText: { color: colors.warning },
  filters: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: { backgroundColor: colors.text, borderColor: colors.text },
  chipLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  chipLabelSelected: { color: colors.surface },
  list: { paddingHorizontal: spacing.lg },
  separator: { height: spacing.md },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemUnavailable: { opacity: 0.55 },
  emojiBox: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 34 },
  itemBody: { flex: 1, gap: 2 },
  itemName: { fontSize: 16, fontWeight: '700', color: colors.text },
  itemDescription: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  itemPrice: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 2 },
  itemAction: { alignItems: 'flex-end' },
  soldOut: { fontSize: 13, fontWeight: '700', color: colors.danger },
  cartBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
  },
  cartCount: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  cartCountText: { color: colors.primaryText, fontWeight: '800' },
  cartLabel: { flex: 1, color: colors.primaryText, fontSize: 16, fontWeight: '700' },
  cartTotal: { color: colors.primaryText, fontSize: 16, fontWeight: '800', fontVariant: ['tabular-nums'] },
  pressed: { opacity: 0.85 },
});
